import { IsEnum, IsNotEmpty, IsOptional, Matches } from "class-validator";
import { WebsiteType } from "./enums/website-type.enum";
import { DnsConfig } from "./dns.config";
import { WithKey } from "simple-ssh";
import { SSHAuthKeyConfig, SSHAuthPasswordConfig } from "./ssh.config";

export abstract class DeploymentConfig {
    @Matches(/((?:[a-z0-9-]+\.)*)([a-z0-9-]+\.[a-z]+)($|\s|:\d{1,5})/)
    @IsNotEmpty()
    public domain: string;

    @IsEnum(WebsiteType)
    @IsNotEmpty()
    public type: WebsiteType;

    @IsOptional()
    public ssl: boolean;
    @IsOptional()
    public dns: DnsConfig;
    public ssh: SSHAuthKeyConfig | SSHAuthPasswordConfig;
}
