import { CommanderError } from "commander";
import { ErrorCodes } from "../error-codes";

export class ConfigFileNotFoundException extends CommanderError {
    constructor() {
        super(1, ErrorCodes.CONFIG_FILE_NOT_FOUND, 'Config file not found.');
    }
}
