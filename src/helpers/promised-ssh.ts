import SSH, { ExecOptions } from "simple-ssh";
import rsync from 'rsyncwrapper';
import { cliLoading } from "./cli-loading";
import { SSHAuthKeyConfig } from "../models/config/ssh.config";

export type SSHResponse = { code: number, stdout: string, stderr: string };
export type RsyncResponse = { error: Error | null, stdout: string, stderr: string, cmd: string };

export type PromisedSSHExecOptions = Omit<ExecOptions, 'err' | 'out' | 'exit'>;

export type RsyncOptions = { src: string, dest: string, exclude: string[], include: string[] };

export class PromisedSSH extends SSH {
    private readonly config: SSHAuthKeyConfig;

    constructor(config: SSHAuthKeyConfig) {
        super(config);
        this.config = config;
    }

    public asyncExec(command: string, options?: PromisedSSHExecOptions): Promise<SSHResponse> {
        return new Promise((resolve, reject) => {
            cliLoading().info('Executing command: ' + command);
            super.exec(command, { ...options, exit: (code, stdout, stderr) => {
                if (code === 0) {
                    super.reset(() => {
                        resolve({ code, stdout, stderr });
                    });
                }
                else {
                    super.reset(() => {
                        reject({ code, stdout, stderr });
                    });
                }
            }}).start();
        });
    }

    public cmd(command: string, options?: PromisedSSHExecOptions): Promise<string> {
        return this.asyncExec(command, options).then(({ stdout }) => stdout);
    }

    public codeCmd(command: string, options?: PromisedSSHExecOptions): Promise<number> {
        return this.asyncExec(command, options)
            .then(({ code }) => code)
            .catch(({ code }) => code);
    }

    public async rsync(options: RsyncOptions): Promise<RsyncResponse> {
        return new Promise((resolve, reject) => {
            const connection = 'key' in this.config
                ? {
                    privateKey: this.config.privateKey,
                }
                : {};

            rsync({
                ssh: true,
                port: this.config.port?.toString() ?? '22',
                delete: true,
                recursive: true,
                ...options,
                ...connection,
                sshCmdArgs: ["-o StrictHostKeyChecking=no"]
            }, (error, stdout, stderr, cmd) => {
                cliLoading().info('Executing rsync: ' + cmd);
                if (error) {
                    cliLoading().fail('Rsync ERROR: ' + JSON.stringify({ error, stdout, stderr, cmd }, null, 2));
                    reject({ error, stdout, stderr, cmd });
                }
                else {
                    cliLoading().info('Rsync success: ' + JSON.stringify({ stdout, cmd }, null, 2));
                    resolve({ error, stdout, stderr, cmd})
                }
            })
        });
    }
}
