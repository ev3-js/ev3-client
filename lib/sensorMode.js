var write = require('./write')

module.exports = write(function (command, port) {
  return {
    type: 'sensor_mode',
    command: command,
    port: port
  }
})
