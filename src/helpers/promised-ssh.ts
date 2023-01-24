import SSH, { ExecOptions } from "simple-ssh";
import { cliLoading } from "./cli-loading";

export type SSHResponse = { code: number, stdout: string, stderr: string };

export type PromisedSSHExecOptions = Omit<ExecOptions, 'err' | 'out' | 'exit'>;

export class PromisedSSH extends SSH {
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
}
