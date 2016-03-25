var move = require('./move')
var read = require('./read')
var channel = require('@f/channel')
var yoco = require('yoco')
var identity = require('@f/identity')
var defaults = require('@f/defaults')
var sensorMode = require('./sensorMode')
var co = yoco.map(identity)

module.exports = {
  robot,
  move,
  read
}

var defaultOpts = {
  touch: 'TOUCH',
  sonic: 'US-DIST-IN',
  color: 'COL-COLOR',
  ir: 'IR-SEEK'
}

function robot (address, opts) {
  try {
    var ws = new WebSocket(`ws://${address}:5000`)
  } catch (e) {
    console.error(e)
    return
  }

  opts = opts || {}
  opts = defaults(opts, defaultOpts)

  var id = 0
  var reads = channel(1)
  var writes = channel()

  ws.onopen = function () {
    ws.send(JSON.stringify({
      type: 'sensor_subscribe',
      id: ++id
    }))
    co(function * () {
      var sensors = yield reads.take()
      yield setSensors(sensors.value)
      while(true) {
        write(yield writes.take())
      }
    })
  }

  ws.onmessage = function (evt) {
    var data = JSON.parse(evt.data)
    if (!data.reply_id)
      reads.put(data)
  }

  function * setSensors (sensors) {
    for (var sensor in sensors) {
      if (sensors[sensor].type !== 'motor') {
        write(sensorMode(opts[sensors[sensor].type], sensor).payload)
      }
    }
  }


  function write (data) {
    ws.send(JSON.stringify({
      type: data.type,
      port: data.port || typeToPort(data.type),
      command: data.command,
      id: ++id,
      opts: data.opts
    }))
  }

  function typeToPort (type) {
    var types = {
      'motors_write': [opts.leftMotor || 'b', opts.rightMotor || 'c'],
      'motor_write': opts.motorPort
    }
    return types[type]
  }

  return yoco.map(action => {
    switch (action.type) {
      case 'WRITE':
        return writes.put(action.payload)
      case 'READ':
        return reads.take()
      case 'STOP':
        throw new Error('Stop called')
        return
    }
  })
}
