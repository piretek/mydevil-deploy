const { YAMLException } = require('js-yaml');
const fs = require('fs');
const yaml = require('js-yaml');
const  { ConfigFileNotFoundException } = require("../models/exceptions/config-file-not-found.exception");
const { ConfigFileIncorrectFormatException } = require("../models/exceptions/config-file-incorrect-format.exception");

export class YmlParser {
    public static parseYmlFile(ymlFilePath: string): object | null {
        try {
            const ymlFileContent = fs.readFileSync(ymlFilePath, 'utf8');

            return yaml.load(ymlFileContent) as object;
        }
        catch(e) {
            if (e instanceof Error) {
                throw new ConfigFileNotFoundException();
            }
            else if (e instanceof YAMLException) {
                throw new ConfigFileIncorrectFormatException();
            }
        }

        return null;
    };
}
