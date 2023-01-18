#! /usr/bin/env node
import { CreateCommand } from "./commands/create";

const commander = require('commander');
const version = require('../package.json').version;

const program = new commander.Command();

program
    .name('mydevil-deploy')
    .description('MyDevil.net hosting website deployment script program.')
    .version(version);

program
    .command('create')
    .description('Creates deployment for the website.')
    .argument('<config file>', 'Path to the .yml configuration file.')
    .action(CreateCommand.execute);

program.parse();
