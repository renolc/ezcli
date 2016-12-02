const path = require('path')
const fs = require('fs')
const log = console.log

const version = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'package.json'), { encoding: 'utf8' })).version

const commands = {}

const printUsage = function (cli) {
  log()
  log('  v'+version)
  log()
  log('  Usage: '+cli+' <command>')
  log()
  log('  Commands:')
  for (var cmd in commands) {
    log('    '+cmd+' '+commands[cmd].args)
  }
  log()
}

const printUsageForCommand = function (cli, cmd) {
  log()
  log('  Usage: '+cli+' '+cmd+' '+commands[cmd].args)
  log()
}

module.exports = function (cli) {
  return {
    command: function (name, fn) {
      if (name.match(/\s/)) throw new Error('Command names cannot contain white space: '+name)
      if (commands[name]) throw new Error('Cannot declare duplicate commands: '+name)

      const cmdString = fn.toString()

      const args = cmdString
        .substring(cmdString.indexOf('(') + 1, cmdString.indexOf(')'))
        .split(',')
        .map(function (i) { return i.trim() })
        .filter(function (i) { return i })
        .map(function (i) { return ~i.indexOf('=') ? '['+i+']' : '<'+i+'>' })

      for (var i = 1; i < args.length; i++) {
        if (args[i][0] === '<' && args[i-1][0] === '[')
          throw new Error('Optional arguments must be declared at the end of the function: '+name+' '+args.join(' '))
      }

      commands[name] = {
        args: args.join(' '),
        requiredArgsCount: args.filter(function (i) { return i[0] === '<' }).length,
        fn: fn
      }

      return this
    },

    process: function () {
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
  }
}