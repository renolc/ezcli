const log = console.log

module.exports = (cli, commands, version) => {
  if (typeof version === 'string') {
    log()
    log(`  v${version}`)
  }
  log()
  log(`  Usage: ${cli} <command>`)
  log()
  log('  Commands:')
  Object.keys(commands).forEach(cmd => log(`    ${cmd} ${commands[cmd].args}`))
  log()
}
