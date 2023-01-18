import { Command } from "commander";

export type CommandAction = Parameters<Command["action"]>[0];
