import { Matches } from "class-validator";
import { SSHConfigWithKeyI, SSHConfigWithPasswordI } from "./interfaces/ssh-config";
import { BaseConfig } from "simple-ssh";

export class SSHConfig implements BaseConfig {
    @Matches(/^s[0-9]+.mydevil.net$/)
    public host: string;
    public user: string;
    public port: number;
}

export class SSHAuthKeyConfig extends SSHConfig implements SSHConfigWithKeyI {
    public key: string;
    public passphrase?: string;
}
export class SSHAuthPasswordConfig extends SSHConfig implements SSHConfigWithPasswordI {
    public pass: string;
}
