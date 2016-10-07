# ezcli [![npm version](https://badge.fury.io/js/ezcli.svg)](https://badge.fury.io/js/ezcli)

Easily create multi-command CLI apps (similar to git).

`ezcli` was inspired by the excellent [`commander.js`](https://github.com/tj/commander.js) package. Check it out if you need something more full-featured.

### Installation

```bash
npm i ezcli -S
```

### Usage

#### package.json

```json
{
  "name": "cli-app",
  "bin": "./app.js"
}
````

#### app.js

```js
#!/bin/usr/env node
const cli = require('ezcli')

cli('cli-app')
  .command('subcommand', () => {
    console.log('in subcommand')
  })
  .command('commandWithArg', (arg) => {
    console.log(`commandWithArgs: ${arg}`)
  })
  .command('optionalParams', (required, optional = 'default') => {
    console.log(`optionalParams: ${required} ${optional}`)
  })
  .process()
```

### API

```js
#!/bin/usr/env node
const cli = require('ezcli')

// declare the cli app name
// this should be the actual command you run in the terminal, ie `cliName <command>`
cli('cliName')

  // this block declares a command that would used via `cliName commandName`
  // upon execution the provided function is run
  // command names must be unique
  .command('commandName', () => {
    console.log('in commandName')
  })

  // if function contains arguments, they will become part of the required command signature
  // ie, `cliName withArgs <arg>`
  .command('withArgs', (arg) => {
    console.log('in withArgs', arg)
  })

  // optional arguments can be defined at the end of the function
  // these are not required during execution
  // ie `cliName optionalArgs` or `cliName optionalArgs [param]`
  .command('optionalArgs', (optional = 'default') => {
    console.log('in optionalArgs', optional)
  })

  // this enables the cli app to process the arguments passed to it
  .process()
```

The above defined CLI app would work like so:

```
~ $ cliName

  Usage: cliName <command>

  Commands:
    commandName
    withArgs <arg>
    optionalArgs [optional = 'default']

~ $ cliName commandName
in commandName

~ $ cliName withArgs

  Usage: cliName withArgs <arg>

~ $ cliName withArgs test
in withArgs test

~ $ cliName optionalArgs
in optionalArgs default

~ $ cliName optionalArgs bork
in optionalArgs bork
```