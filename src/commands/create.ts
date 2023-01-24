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
            loading.info(deploymentName);
            loading.loadText('Creating deployment ' + deploymentName);

            const deployment = config.deployments[deploymentName];

            const devil = await Devil.getInstance(deploymentName, deployment.ssh);

            loading.loadText(`Checking if ${deployment.domain} website exists...`);
            const websites = await devil.getWebsitesList().catch(() => {
                throw new Error('Error reading websites list');
            });

            if (!websites.find(({ domain }) => domain === deployment.domain)) {
                loading.loadText(`Creating ${deployment.domain} website...`);
                await devil.addWebsite(deployment);
                loading.succeed(`Successfully created ${deployment.domain} website.`);
            }

            loading.loadText(`Checking ${deployment.domain} dns zone...`);
            const dnsZones = await devil.getDnsList().catch(() => {
                throw new Error('Error reading dns zones list');
            });

            const subdomainZone = dnsZones.find(({ domain }) => domain === deployment.domain);
            const fqdnDomainZone = dnsZones.find(({ domain }) => domain === tldts.getDomain(deployment.domain));

            const targetDomainZone = subdomainZone?.domain || fqdnDomainZone?.domain;
            if (!targetDomainZone) {
                throw new Error(`Could not find DNS zone for domain ${deployment.domain}`);
            }

            loading.loadText(`Checking ${deployment.domain} dns records...`);
            const dnsRecords = await devil.getDnsRecordList(targetDomainZone).catch(() => {
                throw new Error('Error reading dns records list');
            });

            if (!dnsRecords.find(({ record, dns_type }) => record === deployment.dns.record && dns_type === deployment.dns.type)) {
                loading.loadText(`Adding ${deployment.domain} dns record...`);
                await devil.addDnsRecord(deployment, targetDomainZone);
                loading.succeed(`Successfully added ${deployment.domain} ${deployment.dns.type} dns record.`);
            }

            loading.stop();
        }
    }
}
