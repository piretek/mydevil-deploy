import { PromisedSSH } from "../helpers/promised-ssh";
import { SSHConfig } from "simple-ssh";
import { DevilDnsRecord } from "../models/devil-dns-record";
import { DevilDnsZone } from "../models/devil-dns-zone";
import { DeploymentConfig } from "../models/config/deployment.config";
import { WebsiteType } from "../models/config/enums/website-type.enum";
import { DnsRecord } from "../models/config/enums/dns-record.enum";
import { DevilBasicResponse } from "../models/devil/devil-basic-response";
import { DevilDnsRecordsListResponse } from "../models/devil/responses/devil-dns-records-list-response";
import { DevilDnsZonesListResponse } from "../models/devil/responses/devil-dns-zones-list-response";
import { DevilWebsitesListResponse } from "../models/devil/responses/devil-websites-list-response";
import { DevilWebsite } from "../models/devil-website";

export class Devil {
    public static instance: Record<string, Devil> = {};
    private ssh: PromisedSSH;

    public static getInstance(deploymentName: string, sshConfig: SSHConfig): Devil {
        if (!(deploymentName in Devil.instance)) {
            Devil.instance[deploymentName] = new Devil(sshConfig);
        }

        return Devil.instance[deploymentName];
    }

    protected constructor(sshConfig: SSHConfig) {
        this.ssh = new PromisedSSH(sshConfig);
    }

    private prepareCommand(args: (string|number)[]): string {
        const prefix = 'echo "[';
        const suffix = ']" | nc -U /var/run/devil2.sock';

        const commandArguments = ['--json', ...args]
            .map(arg => typeof arg === 'number' ? arg.toString() : arg)
            .map(arg => arg.replace(/"/g, '\\"'))
            .map(arg => `'${arg}'`)
            .join(',');

        return prefix + commandArguments + suffix;
    }

    private async getCmdResponse<Response extends DevilBasicResponse>(args: string[]): Promise<Response> {
        return JSON.parse(
            await this.ssh.cmd(this.prepareCommand(args))
        );
    }

    public async getDnsList(): Promise<DevilDnsZone[]> {
        return (await this.getCmdResponse<DevilDnsZonesListResponse>(['dns', 'list'])).domains;
    }

    public async getDnsRecordList(domain: string): Promise<DevilDnsRecord[]> {
        return (await this.getCmdResponse<DevilDnsRecordsListResponse>(['dns', 'list', domain])).records;
    }

    public async getWebsitesList(): Promise<DevilWebsite[]> {
        return (await this.getCmdResponse<DevilWebsitesListResponse>(['www', 'list'])).websites;
    }

    public async addWebsite(deployment: DeploymentConfig): Promise<void> {
        switch (deployment.type) {
            case WebsiteType.PHP:
                await this.ssh.codeCmd(
                    this.prepareCommand(['www', 'add', deployment.domain, 'php'])
                );
                break;
            default:
                throw new Error(`Unsupported website type: ${deployment.type}`);
        }
    }

    public async addDnsRecord(deployment: DeploymentConfig, targetDomain: string): Promise<void> {
        const { content, record, type = DnsRecord.A, priority, weight, ttl } = deployment.dns;

        let args = priority && weight
            ? [targetDomain, record, type, priority, weight, (content as string)]
            : priority
                ? [targetDomain, record, type, priority, (content as string)]
                : [targetDomain, record, type, (content as string)];

        if (ttl) {
            args = [...args, ttl];
        }

        const command = this.prepareCommand(['dns','add', ...args]);

        await this.ssh.cmd(command);
    }
}
