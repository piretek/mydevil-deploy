export class DeploymentSyncConfig {
    public dir: string;
    public include: string[];
    public exclude: string[];
    public commands: {
        before: string[];
        after: string[];
    }
}
