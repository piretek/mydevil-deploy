import { IsEnum, IsNotEmpty, IsOptional, Matches, ValidateNested } from "class-validator";
import { WebsiteType } from "./enums/website-type.enum";
import { DnsConfig } from "./dns.config";
import { SSHAuthKeyConfig } from "./ssh.config";
import { DeploymentFilesConfig } from "./deployment-files.config";

export abstract class DeploymentConfig {
    @Matches(/((?:[a-z0-9-]+\.)*)([a-z0-9-]+\.[a-z]+)($|\s|:\d{1,5})/)
    @IsNotEmpty()
    public domain: string;

    @IsEnum(WebsiteType)
    @IsNotEmpty()
    public type: WebsiteType;
    @ValidateNested()
    public files: string[] | DeploymentFilesConfig;

    @IsOptional()
    public ssl: boolean;
    @IsOptional()
    @ValidateNested()
    public dns: DnsConfig;
    @ValidateNested()
    public ssh: SSHAuthKeyConfig;
}
