import { PromisedSSH } from "../helpers/promised-ssh";
import { SSHConfig } from "simple-ssh";
import { DevilResponseColumns } from "../models/devil-response-columns";
import { convertToDevilDnsRecord, DEVIL_DNS_RECORD_COLUMNS_MAP, DevilDnsRecord } from "../models/devil-dns-record";
import { convertToDevilDnsZone, DEVIL_DNS_ZONE_COLUMNS_MAP, DevilDnsZone } from "../models/devil-dns-zone";
import { ColumnMap } from "../models/types/column-map";
import {
    convertToDevilWebsitesList,
    DEVIL_WEBSITES_LIST_COLUMNS_MAP,
    DevilWebsitesList
} from "../models/devil-websites-list";
import { DeploymentConfig } from "../models/config/deployment.config";
import { WebsiteType } from "../models/config/enums/website-type.enum";
import { DnsRecord } from "../models/config/enums/dns-record.enum";

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

    private parseResponseTable<T>(response: string, columnMap: ColumnMap<T>, convertFunction: ParseResponseTableConvertFunction<T>): T[] {
        const lines = response.replace(/\x1b\[[0-9;]*m/g, '').split('\n');
        const columns = this.calculateSizeOfColumns<T>(lines[0], columnMap);

        return lines
            .slice(2)
            .filter(line => line.trim().length > 0)
            .map((line) => this.stripContentsBasedOnColumns(line, columns, convertFunction));
    }

    private calculateSizeOfColumns<T>(header: string, columnMap: ColumnMap<T>): DevilResponseColumns[] {
        const columns: DevilResponseColumns[] = [];

        for (const responseColumn in columnMap) {
            const regex = new RegExp(`(${responseColumn.trim().replace(/\s/g, '\\s')})\\s*`, 'gm')

            const matches = header.match(regex);

            if (matches) {
                columns.push({
                    name: matches[0].trim(),
                    size: matches[0].length
                });
            }
        }


        return columns;
    }

    private stripContentsBasedOnColumns<T>(line: string, columns: DevilResponseColumns[], convertFunction: ParseResponseTableConvertFunction<T>): T {
        const value: string[] = [];

        let lastColumnSize = 0;

        for (let index in columns) {
            const {size} = columns[index];

            const content = line.substring(lastColumnSize, Number(index) === columns.length - 1 ? undefined : lastColumnSize + size);
            value.push(content.trim());

            lastColumnSize = lastColumnSize + size;
        }

        return convertFunction(value);
    }

    public async getDnsList(): Promise<DevilDnsZone[]> {
        return this.parseResponseTable<DevilDnsZone>(
            await this.ssh.cmd('devil dns list'),
            DEVIL_DNS_ZONE_COLUMNS_MAP,
            convertToDevilDnsZone
        );
    }

    public async getDnsRecordList(domain: string): Promise<DevilDnsRecord[]> {
        return this.parseResponseTable<DevilDnsRecord>(
            await this.ssh.cmd(`devil dns list ${domain}`),
            DEVIL_DNS_RECORD_COLUMNS_MAP,
            convertToDevilDnsRecord
        );
    }

    public async getWebsitesList(): Promise<DevilWebsitesList[]> {
        return this.parseResponseTable<DevilWebsitesList>(
            await this.ssh.cmd(`devil www list`),
            DEVIL_WEBSITES_LIST_COLUMNS_MAP,
            convertToDevilWebsitesList
        )
    }

    public async addWebsite(deployment: DeploymentConfig): Promise<void> {
        switch (deployment.type) {
            case WebsiteType.PHP:
                await this.ssh.codeCmd(`devil www add ${deployment.domain} php`);
                break;
            default:
                throw new Error(`Unsupported website type: ${deployment.type}`);
        }
    }

    public async addDnsRecord(deployment: DeploymentConfig, targetDomain: string): Promise<void> {
        const {content, record, type = DnsRecord.A, priority, weight, ttl} = deployment.dns;

        let command = priority && weight
            ? `devil dns add ${targetDomain} ${record} ${type} ${priority} ${weight} ${content}`
            : priority
                ? `devil dns add ${targetDomain} ${record} ${type} ${priority} ${content}`
                : `devil dns add ${targetDomain} ${record} ${type} ${content}`;

        if (ttl) {
            command += ` ${ttl}`;
        }

        await this.ssh.cmd(command);
    }
}

export type ParseResponseTableConvertFunction<T> = (stringRecords: string[]) => T;
