#! /usr/bin/env node
import { CreateCommand } from "./commands/create";
import { cliLoading } from "./helpers/cli-loading";

const commander = require('commander');
const version = require('../package.json').version;

const cli = cliLoading('MyDevil Deployments');

try {
    const program = new commander.Command();

    program
        .name('mydevil-deploy')
        .description('MyDevil.net hosting website deployment script program.')
        .version(version)
        .option('-v, --verbose', 'verbose output')

    program.on('verbose', function () {
        cli.setVerbose(true);
    })

    program
        .command('create')
        .description('Creates deployment for the website.')
        .argument('<config file>', 'Path to the .yml configuration file.')
        .action(CreateCommand.execute);

    program.parse();

}
catch(err) {
    cliLoading().exceptionHandler(err as Error);
}
