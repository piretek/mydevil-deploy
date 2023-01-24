import { CommanderError } from "commander";
import { ErrorCodes } from "../error-codes";

export class SshPrivateKeyNotFoundException extends CommanderError {
    constructor() {
        super(3, ErrorCodes.SSH_PRIVATE_KEY_NOT_FOUND, 'SSH private key not found.');
    }
}
