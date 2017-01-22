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
  "version": "1.0.0",
  "bin": "./app.js"
}
````

#### app.js

```js
#!/usr/bin/env node
const cli = require('ezcli')

cli('cli-app')
  .command('subcommand', () => {
    console.log('in subcommand')
  })
  .command('commandWithArg', arg => {
    console.log(`commandWithArgs: ${arg}`)
  })
  .command('optionalParams', (required, optional = 'default') => {
    console.log(`optionalParams: ${required} ${optional}`)
  })
  .process()
```

#### Resulting app

```
~ $ cli-app

  v1.0.0

  Usage: cli-app <command>

  Commands:
    subcommand
    commandWithArg <arg>
    optionalParams <required> [optional = 'default']

~ $ cli-app subcommand
in subcommand

~ $ cli-app commandWithArg

  Usage: cli-app commandWithArg <arg>

~ $ cli-app commandWithArg test
commandWithArgs: test

~ $ cli-app optionalParams

  Usage: cli-app optionalParams <required> [optional = 'default']

~ $ cli-app optionalParams abc
optionalParams: abc default

~ $ cli-app optionalParams abc 123
optionalParams: abc 123
```

### API

#### `cli(name:string)`

Declare the cli app with the given `name`. The name should match the defined binary name in your `package.json` ([more info](https://docs.npmjs.com/files/package.json#bin)).

#### `command(name:string, fn:function)`

Define a subcommand with a given `name`. Names should be unique and should contain no whitespace. `fn` will be executed when this subcommand is invoked.

Any parameters defined in `fn` will become part of the command signature. E.g., `command('test', thing => {})` will produce the signature `test <thing>`.

Optional parameters are acceptible, but only at the end of the parameter list. E.g., `command('test', (a, b='default') => {})` will produce `test <a> [b='default']`.

`command` is chainable, so you may add several commands in sequence.

#### `process()`

`process` is used to indicate the end of your cli app definition. Once it is called, it will beging processing any command line arguments passed in to your cli app, and will execute the correct subcommand or print usage information.

### Assumptions and Considerations

`ezcli` assumes there is a `version` defined in your `package.json`. It will automatically use this as part of your app usage message.

`ezcli` will work on any node version >= 0.10.0, but certain features require greater minimum versions:

- arrow functions (`() => {}`) require node >= 4.0.0
- default parameters (`(test = 'default') => {}`) require node >= 6.0.0

If you use either of these features, it is recommended that you set the required minimum node version within your `package.json` ([more info](https://docs.npmjs.com/files/package.json#engines))