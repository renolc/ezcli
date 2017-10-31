const log = console.log

module.exports = (cli, cmd, commands) => {
  log()
  log(`  Usage: ${cli} ${cmd} ${commands[cmd].args}`)
  log()
}