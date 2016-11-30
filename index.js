const path = require('path')
const fs = require('fs')
const log = console.log

const version = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'package.json'), { encoding: 'utf8' })).version

const commands = {}

const printUsage = (cli) => {
  log()
  log(`  v${version}`)
  log()
  log(`  Usage: ${cli} <command>`)
  log()
  log('  Commands:')
  for (let cmd in commands) {
    log(`    ${cmd} ${commands[cmd].args}`)
  }
  log()
}

const printUsageForCommand = (cli, cmd) => {
  log()
  log(`  Usage: ${cli} ${cmd} ${commands[cmd].args}`)
  log()
}

module.exports = (cli) => ({
  command(name, fn) {
    if (commands[name]) throw new Error(`Cannot declare duplicate commands: ${name}`)

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

    commands[name] = {
      args: args.join(' '),
      requiredArgsCount: args.filter((i) => i.startsWith('<')).length,
      fn
    }

    return this
  },

  process() {
    if (process.argv.length < 3) {
      return printUsage(cli)
    }

    const cmd = process.argv[2]
    const args = process.argv.slice(3)
    const command = commands[cmd]

    if (!command) return printUsage(cli)

    if (args.length >= command.requiredArgsCount) command.fn.apply(null, args)
    else printUsageForCommand(cli, cmd)
  }
})