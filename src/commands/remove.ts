import { Command } from "../models/command";
import { cliLoading } from "../helpers/cli-loading";
import { ConfigUtil } from "../helpers/config-util";

export class RemoveCommand implements Command {
    public static async execute(configFile: string, deploymentDomain: string): Promise<void> {
        const loading = cliLoading(`Removing deployment for ${deploymentDomain}...`);

        const config = await ConfigUtil.getConfigFromFile(configFile);
        //
        // const deployment = config.deployments.find(d => d.domain)
    }
}
