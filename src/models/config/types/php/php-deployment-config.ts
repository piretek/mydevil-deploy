import { DeploymentConfig } from "../../deployment.config";
import { WebsiteType } from "../../enums/website-type.enum";
import { PhpDeploymentOptions } from "./php-deployment-options";
import { IsOptional } from "class-validator";

export class PhpDeploymentConfig extends DeploymentConfig {
    public type = WebsiteType.PHP;
    @IsOptional()
    public options: PhpDeploymentOptions;
}
