import { CommanderError } from "commander";
import { ErrorCodes } from "../error-codes";

export class ConfigFileIncorrectFormatException extends CommanderError {
    constructor() {
        super(2, ErrorCodes.CONFIG_FILE_INCORRECT_FORMAT, 'Config file incorrect format.');
    }
}
