import { BaseConfig, WithKey, WithPassword } from "simple-ssh";

type SSHConfigWithPassword = BaseConfig & WithPassword;
type SSHConfigWithKey = BaseConfig & WithKey;

export interface SSHConfigWithPasswordI extends SSHConfigWithPassword {
}
export interface SSHConfigWithKeyI extends SSHConfigWithKey {
}
