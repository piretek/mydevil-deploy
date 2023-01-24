import { Command } from "../models/command";
import { ConfigUtil } from "../helpers/config-util";
import { validate } from "class-validator";
import { Devil } from "../helpers/devil";
import tldts from 'tldts';
import { cliLoading } from "../helpers/cli-loading";

export class CreateCommand implements Command {
    public static async execute(configAction: string): Promise<void> {

        const loading = cliLoading('Creating deployments...');
        const config = await ConfigUtil.getConfigFromFile(configAction);

        await validate(config);

        for (const deploymentName in config.deployments) {
            loading.text = 'Creating deployment ' + deploymentName;

            const deployment = config.deployments[deploymentName];

            const devil = await Devil.getInstance(deploymentName, deployment.ssh);

            const websites = await devil.getWebsitesList().catch(() => {
                loading.stop();
                throw new Error('Error reading websites list');
            });

            if (!websites.find(({ domain_name }) => domain_name === deployment.domain)) {
                await devil.addWebsite(deployment);
            }

            const dnsZones = await devil.getDnsList().catch(() => {
                loading.stop();
                throw new Error('Error reading dns zones list');
            });
            const subdomainZone = dnsZones.find(({ name }) => name === deployment.domain);
            const fqdnDomainZone = dnsZones.find(({ name }) => name === tldts.getDomain(deployment.domain));

            const targetDomainZone = subdomainZone?.name || fqdnDomainZone?.name;
            if (!targetDomainZone) {
                loading.stop();
                throw new Error(`Could not find DNS zone for domain ${deployment.domain}`);
            }

            const dnsRecords = await devil.getDnsRecordList(targetDomainZone).catch(() => {
                loading.stop();
                throw new Error('Error reading dns records list');
            });

            if (!dnsRecords.find(({ record, type }) => record === deployment.dns.record && type === deployment.dns.type)) {
                await devil.addDnsRecord(deployment, targetDomainZone);
            }

            loading.stop();
        }
    }
}
