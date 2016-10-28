const path = require('path')
const fs = require('fs')
const log = console.log

const version = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'package.json'), { encoding: 'utf8' })).version

const commands = []

const printUsage = (cli) => {
  log()
  log(`  v${version}`)
  log()
  log(`  Usage: ${cli} <command>`)
  log()
  log('  Commands:')
  commands.forEach((cmd) => log(`    ${cmd.name} ${cmd.args.join(' ')}`.trimRight()))
  log()
}

const printUsageForCommand = (cli, cmd) => {
  log()
  log(`  Usage: ${cli} ${cmd.name} ${cmd.args.join(' ')}`)
  log()
}

const runCommand = (cli, cmd, args) => {
  const command = commands.find((i) => i.name === cmd)

  if (!command) return printUsage(cli)

  if (args.length >= command.requiredArgs.length) command.fn.apply(null, args)
  else printUsageForCommand(cli, command)
}

module.exports = (cli) => ({
  command: function (name, fn) {
    if (commands.find((i) => i.name === name)) throw new Error(`Cannot declare duplicate commands: ${name}`)

    const cmdString = fn.toString()
    const args = cmdString
      .substring(cmdString.indexOf('(') + 1, cmdString.indexOf(')'))
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i)
      .map((i) => i.includes('=') ? `[${i}]` : `<${i}>`)

    for (let i = 1; i < args.length; i++) {
      if (args[i].startsWith('<') && args[i-1].startsWith('['))
        throw new Error(`Optional arguments must be declared at the end of the function: ${name} ${args.join(' ')}`)
    }

    commands.push({
      name,
      args,
      requiredArgs: args.filter((i) => i.startsWith('<')),
      fn
    })

    return this
  },

  process: function () {
    if (process.argv.length < 3) {
      return printUsage(cli)
    }

    runCommand(cli, process.argv[2], process.argv.slice(3))
  }
})