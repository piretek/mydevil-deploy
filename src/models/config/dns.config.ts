import { DnsRecord } from "./enums/dns-record.enum";
import { IsNumber, IsOptional } from "class-validator";

export class DnsConfig {
    public record: string;
    public type: DnsRecord = DnsRecord.A;
    @IsOptional()
    public content?: string;
    @IsNumber()
    public priority?: number | null;
    @IsNumber()
    public weight?: number | null;
    @IsNumber()
    public ttl?: number | null;
}
