const RUN = 'ev3-client/RUN'
const WRITE = 'ev3-client/WRITE'
const READ = 'ev3-client/READ'
var createAction = require('@f/create-action')

function runAction (it) {
  return {
    type: RUN,
    payload: it
  }
}

function * read () {
  var vals = yield {
    type: READ
  }
  var sensors = vals.value

  return {
    motor: getValue('motor'),
    sonic: getValue('sonic'),
    touch: getValue('touch'),
    color: getValue('color'),
    ir: getValue('ir')
  }

  function getValue (name) {
    return function (port) {
      if (!sensors[port]) {
        throw new Error(`No device found in port: ${port}`)
      }
      if (sensors[port].type !== name) {
        throw new Error(`Port ${port} does not match type ${name}`)
      }
      return sensors[port].value
    }
  }
}

function write (type, port) {
  return createAction(WRITE, writeCommand)

  function writeCommand (command, opts) {
    return {
      type: type,
      command: command,
      opts: opts,
      port: port
    }
  }
}

module.exports = {
  RUN: RUN,
  WRITE: WRITE,
  READ: READ,

  runAction: runAction,
  write: write,
  read: read
}
