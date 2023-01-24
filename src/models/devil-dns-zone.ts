import { ColumnMap } from "./types/column-map";

export interface DevilDnsZone {
    name: string;
    dnsServers: string[];
}

export const DEVIL_DNS_ZONE_COLUMNS_MAP: ColumnMap<DevilDnsZone> = {
    'Nazwa domeny': 'name',
    'Serwery DNS': 'dnsServers'
};

export const convertToDevilDnsZone = (stringRecords: string[]): DevilDnsZone => {
    const [ name, dnsServers ] = stringRecords;
    return {
        name,
        dnsServers: dnsServers.split(', ')
    };
}
