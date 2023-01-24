import { DeploymentsConfig } from "./config/deployments.config";
import { ValidateNested } from "class-validator";

export class ConfigFile {
    @ValidateNested()
    public deployments: DeploymentsConfig;
}
