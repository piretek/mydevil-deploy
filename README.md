# MyDevil.net Deployments

> **Warning**
> This package is still in development and not ready for production use.
> It was not published to npm or yarn yet.
> Use it at your own risk. All the work is done in [develop](https://github.com/piretek/mydevil-deploy/tree/develop) branch.

I needed some tool to deploy my projects to [MyDevil.net](https://mydevil.net) hosting that enable me possibility to
dynamically change the configuration of the project. I didn't find any tool that would meet my needs, so I decided
to create my own. Hope you will find it useful. You can use it in your CI/CD pipeline or just run it manually from
the project. It uses SSH connection to upload files to the server and then run commands on the server.

## Installation

```bash
$ npm install -g mydevil-deploy
```
or with yarn
```bash
$ yarn global add mydevil-deploy
```

# Usage
```bash
$ mydevil-deploy help
```
```
Usage: mydevil-deploy [options] [command]

MyDevil.net hosting website deployment script program.

Options:
  -V, --version         output the version number
  -h, --help            display help for command

Commands:
  create <config file>  Creates deployment for the website.
  help [command]        display help for command
```

## Creating deployment
First, you need to create basic configuration file (temporarily supports only YAML):
```yaml
# Path: deployment.yml
deployments:
  test:
    domain: test.my-example-project.com
    type: php
    ssh:
      host: sXX.mydevil.net
      user: example
      key: <filepath to ssh privkey>
      port: 22
  production:
    domain: my-example-project.com
    type: php
    ssh:
      host: sXX.mydevil.net
      user: example
      key: <filepath to ssh privkey>
      port: 22
```
You can specify here various, multiple deployment environments.

Available modules: `PHP` (others will be introduced in future).

Then you call:
```bash
$ mydevil-deploy create deployment.yaml
```
And watch how the deployment is created 😁.

### If you need help
```bash
$ mydevil-deploy create help
```
```
Usage: mydevil-deploy create [options] <config file>

Creates deployment for the website.

Arguments:
  config file  Path to the .yml configuration file.

Options:
  -h, --help   display help for command
```
# Authors:
- [Piotr Czarnecki](https://gist.github.com/piretek)
