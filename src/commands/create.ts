import { Command } from "../models/command";
import { YmlParser } from "../helpers/yml-parser";

export class CreateCommand implements Command {
    public static execute(configAction: string): void {
        console.log('Creating deployment for the website.', configAction);
        console.log('Config:', YmlParser.parseYmlFile(configAction));
    };
}
