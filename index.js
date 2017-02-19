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
  Object.keys(commands).forEach((cmd) => log(`    ${cmd} ${commands[cmd].args}`))
  log()
}

const printUsageForCommand = (cli, cmd) => {
  log()
  log(`  Usage: ${cli} ${cmd} ${commands[cmd].args}`)
  log()
}

module.exports = (cli) => ({
  command (name, fn) {
    if (name.match(/\s/)) throw new Error(`Command names cannot contain white space: ${name}`)
    if (commands[name]) throw new Error(`Command names must be unique: ${name}`)

    const cmdString = fn.toString()

    const args = cmdString
      .split('=>')[0]
      .split('(')
      .slice(-1)[0]
      .split(')')[0]
      .split(',')
      .map((i) => i.trim())
      .filter((i) => i)
      .map((i) => i.includes('=') ? `[${i}]` : `<${i}>`)

    for (var i = 1; i < args.length; i++) {
      if (args[i].startsWith('<') && args[i-1].startsWith('['))
        throw new Error(`Optional arguments must be declared at the end of the function: ${name} ${args.join(' ')}`)
    }

    commands[name] = {
      args: args.join(' '),
      requiredArgsCount: args.filter(i => i.startsWith('<')).length,
      fn
    }

    return this
  },

  process () {
    const cmd = process.argv[2]
    const args = process.argv.slice(3)
    const command = commands[cmd]

    if (!command) return printUsage(cli)

    if (args.length >= command.requiredArgsCount) command.fn.apply(null, args)
    else printUsageForCommand(cli, cmd)
  }
})