import { ColumnMap } from "./types/column-map";

export interface DevilDnsRecord {
    id: string;
    record: string;
    type: string;
    priority: number | null;
    weight: number | null;
    ttl: number | null;
    value: string;
}

export const DEVIL_DNS_RECORD_COLUMNS_MAP: ColumnMap<DevilDnsRecord> = {
    '#': 'id',
    'Rekord': 'record',
    'Typ': 'type',
    'Prio': 'priority',
    'Waga': 'weight',
    'TTL': 'ttl',
    'Zawartość': 'value'
};

export const convertToDevilDnsRecord = (stringRecords: string[]): DevilDnsRecord => {
    const [ id, record, type, priority, weight, ttl, value] = stringRecords;

    return {
        id,
        record,
        type,
        priority: priority !== 'None' ? Number(priority) : null,
        weight: weight !== 'None' ? Number(weight) : null,
        ttl: ttl !== 'None' ? Number(ttl) : null,
        value
    };
}
