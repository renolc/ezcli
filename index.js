const path = require('path')
const fs = require('fs')
const getParams = require('get-function-params')

const printUsage = require('./src/print-usage')
const printCommandUsage = require('./src/print-command-usage')

module.exports = cli => ({
  commands: {},

  command(name, fn) {
    if (name.match(/\s/))
      throw new Error(`Command names cannot contain white space: ${name}`)
    if (this.commands[name])
      throw new Error(`Command names must be unique: ${name}`)

    const args = getParams(fn).map(i =>
      i.default ? `[${i.param} = ${i.default}]` : `<${i.param}>`
    )

    for (var i = 1; i < args.length; i++) {
      if (args[i].startsWith('<') && args[i - 1].startsWith('['))
        throw new Error(
          `Optional arguments must be declared at the end of the function: ${name} ${args.join(
            ' '
          )}`
        )
    }

    this.commands[name] = {
      args: args.join(' '),
      requiredArgsCount: args.filter(i => i.startsWith('<')).length,
      fn
    }

    return this
  },

  process() {
    const [cmd, ...args] = process.argv.slice(2)
    const command = this.commands[cmd]

    const versionPath = path.resolve(__dirname, '..', '..', 'package.json')
    const version =
      fs.existsSync(versionPath) &&
      JSON.parse(fs.readFileSync(versionPath, { encoding: 'utf8' })).version

    if (!command) return printUsage(cli, this.commands, version)

    if (args.length >= command.requiredArgsCount) command.fn.apply(null, args)
    else printCommandUsage(cli, cmd, this.commands)
  }
})
