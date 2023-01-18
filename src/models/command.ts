import { CommandAction } from "./types/action";

export abstract class Command {
    public static execute: CommandAction
}
