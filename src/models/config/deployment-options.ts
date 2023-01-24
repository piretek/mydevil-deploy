import { CacheOptions } from "./enums/cache-options.enum";
import { IsEnum, IsOptional, Matches } from "class-validator";

export class DeploymentOptions {

    @IsOptional()
    public gzip: boolean;
    @IsOptional()
    public sslonly: boolean;
    @IsOptional()
    public plnet: boolean;
    @IsEnum(CacheOptions)
    @IsOptional()
    public cache: CacheOptions;
    @IsOptional()
    public cache_cookie: 'any' | 'none' | 'name';
    @IsOptional()
    public cache_debug: boolean;
    @IsOptional()
    public waf: 0 | 1 | 2 | 3 | 4 | 5;
    @IsOptional()
    public stats_anonymize: boolean;

    @Matches(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:,(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/)
    @IsOptional()
    public stats_exclude: string;
    @IsOptional()
    public processes: number;
    @IsOptional()
    public tls_min: '1.0' | '1.1' | '1.2' | '1.3';
}
