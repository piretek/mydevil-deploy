import { DeploymentOptions } from "../../deployment-options";
import { IsOptional } from "class-validator";

export class PhpDeploymentOptions extends DeploymentOptions {
    @IsOptional()
    public php_eval: boolean;
    @IsOptional()
    public php_exec: boolean;
    @IsOptional()
    public php_openbasedir: string;
}
