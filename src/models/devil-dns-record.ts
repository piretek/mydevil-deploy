export interface DevilDnsRecord {
    id: number;
    domain: number;
    record: string;
    dns_type: string;
    prio: number | null;
    weight: number | null;
    ttl: number;
    content: string;
}
