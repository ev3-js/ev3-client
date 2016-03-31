var move = require('./move')
var read = require('./read')
var motor = require('./motor')
var channel = require('@f/channel')
var yoco = require('yoco')
var identity = require('@f/identity')
var defaults = require('@f/defaults')
var isGenerator = require('@f/is-generator')
var logError = require('@f/log-error')
var sensorMode = require('./sensorMode')
var sleep = require('@f/sleep')
var deepEqual = require('deep-equal')
var co = yoco.map(identity)

module.exports = {
  robot,
  move,
  read,
  stop,
  sleep,
  motor
}

var defaultOpts = {
  touch: 'TOUCH',
  sonic: 'US-DIST-IN',
  color: 'COL-COLOR',
  ir: 'IR-SEEK'
}
var _stop
var lastWrite

function robot (address, opts) {

  var ws = new WebSocket(`ws://${address}:5000`)
  ws.onerror = function (error) {
    console.error(`Could not connect to the robot at ${address}`)
    ws.close()
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
    if (!data.ok) {
      console.error(data.value)
    }
    if (!data.reply_id) {
      reads.put(data)
    }
  }

  function * setSensors (sensors) {
    for (var sensor in sensors) {
      if (sensors[sensor].type !== 'motor') {
        write(sensorMode(opts[sensors[sensor].type], sensor).payload)
      }
    }
  }


  function write (data) {
    if (deepEqual(data, lastWrite)) {
      return
    }
    lastWrite = data
    ws.send(JSON.stringify({
      type: data.type,
      port: data.port,
      command: data.command,
      id: ++id,
      opts: data.opts
    }))
  }

  var dispatch =  yoco.map(action => {
    switch (action.type) {
      case 'WRITE':
        return writes.put(action.payload)
      case 'READ':
        return reads.take()
    }
  })

  return function (it) {
    stop()
    if (isGenerator(it)) {
      it = it()
    }
    _stop = function () {
      try {
        it.throw(new Error('STOP'))
      } catch (e) {
        if (e.message !== 'STOP') {
          throw e
        }
      }
    }
    return dispatch(it)
  }
}

function stop() {
  _stop && _stop()
}
