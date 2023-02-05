import tldts from 'tldts';
import { Command } from "../models/command";
import { ConfigUtil } from "../helpers/config-util";
import { Devil } from "../helpers/devil";
import { cliLoading } from "../helpers/cli-loading";
import { DeploymentSyncConfig } from "../models/config/deployment-sync.config";
import isValidDomain from "is-valid-domain";
import yaml from 'js-yaml';

export class CreateCommand implements Command {
    public static async execute(configFile: string): Promise<void> {

        const loading = cliLoading('Creating deployments...');
        const config = await ConfigUtil.getConfigFromFile(configFile);

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

            const sync: DeploymentSyncConfig = deployment?.sync as DeploymentSyncConfig;
            const { commands: { before, after }} = sync;

            loading.loadText('Executing before sync commands...');
            for (const command of before) {
                loading.loadText('Executing command: ' + command);
                await devil.runCommand(command);
            }

            loading.loadText(`Syncing ${deployment.domain} website with local changes...`);
            await devil.syncFiles(deployment);
            loading.succeed('Successfully synced website with local changes.');

            loading.loadText('Executing after sync commands...');
            for (const command of after) {
                loading.loadText('Executing command: ' + command);
                await devil.runCommand(command);
            }

            loading.stop();

            console.log('\nDeployment created successfully! 🥳🥳')
            console.log('URL to access your website: http://' + deployment.domain);
            console.log('To remove this deployment, run: mydevil-deploy remove <deployment domain>');

            const deploymentConfigToSave = { ...deployment, ssh: { baseDir: deployment.ssh.baseDir } };

            const lastFolder: string = deployment?.ssh?.baseDir.split('/').filter((f) => f.trim().length > 0).pop() ?? '';
            const saveCommand = `echo "${yaml.dump(deploymentConfigToSave)}" > .mydevil-deployment`;
            await devil.runCommand(!isValidDomain(lastFolder)
                ? `cd ${deployment?.ssh?.baseDir}/.. && ${saveCommand}`
                : saveCommand
            );
        }
    }
}
