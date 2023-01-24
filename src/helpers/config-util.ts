import { YmlParser } from "./yml-parser";
import { ConfigFile } from "../models/config-file";
import fs from "fs";
import { SshPrivateKeyNotFoundException } from "../models/exceptions/ssh-private-key-not-found.exception";
import { DnsRecord } from "../models/config/enums/dns-record.enum";
import tldts from "tldts";
import { DnsConfig } from "../models/config/dns.config";
import { SSHAuthKeyConfig } from "../models/config/ssh.config";

export class ConfigUtil {
    public static async getConfigFromFile(configPath: string): Promise<ConfigFile> {
        const config: ConfigFile = await YmlParser.parseYmlFile(configPath) as ConfigFile;

        for (const deploymentName in config.deployments) {
            if ('key' in config.deployments[deploymentName]?.ssh) {
                const sshConfig = config.deployments[deploymentName].ssh as SSHAuthKeyConfig;
                if (!fs.existsSync(sshConfig.key)) {
                    throw new SshPrivateKeyNotFoundException();
                }

                (config.deployments[deploymentName].ssh as SSHAuthKeyConfig).key = fs.readFileSync(sshConfig.key, 'utf8');
            }

            const defaultConfig: DnsConfig = {
                record: tldts.getSubdomain(config.deployments[deploymentName].domain) ?? '*',
                type: DnsRecord.CNAME,
                ttl: null,
                priority: null,
                weight: null,
                content: tldts.getDomain(config.deployments[deploymentName].domain) as string
            };

            config.deployments[deploymentName].dns = {
                record: config.deployments[deploymentName]?.dns?.record || defaultConfig.record,
                type: config.deployments[deploymentName]?.dns?.type || defaultConfig.type,
                ttl: config.deployments[deploymentName]?.dns?.ttl || defaultConfig.ttl,
                priority: config.deployments[deploymentName]?.dns?.priority || defaultConfig.priority,
                weight: config.deployments[deploymentName]?.dns?.weight || defaultConfig.weight,
                content: config.deployments[deploymentName]?.dns?.content || defaultConfig.content,
            }
        }

        return config;
    }
}
