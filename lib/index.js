var channel = require('@f/channel')
var yoco = require('yoco')
var identity = require('@f/identity')
var defaults = require('@f/defaults')
var isGenerator = require('@f/is-generator')
var sleep = require('@f/sleep')

if (typeof WebSocket === 'undefined') {
  WebSocket = require('ws')
}

var move = require('./move')
var motor = require('./motor')
var actions = require('./actions')

var RUN = actions.RUN
var READ = actions.READ
var WRITE = actions.WRITE
var read = actions.read
var runAction = actions.runAction
var co = yoco.map(identity)
yoco = yoco.default

module.exports = {
  robot,
  move,
  read,
  sleep,
  motor,
  runAction
}

var defaultOpts = {
  touch: 'TOUCH',
  sonic: 'US-DIST-IN',
  color: 'COL-COLOR',
  ir: 'IR-SEEK'
}
var _stop

function robot (address, opts) {
  var ws = new WebSocket(`ws://${address}:5000`)

  ws.onerror = function (msg) {
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
      while (true) {
        send(yield writes.take())
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
        yield send({type: 'sensor_mode', port: sensor, command: opts[sensors[sensor].type]})
      }
    }
  }

  function send (data) {
    ws.send(JSON.stringify({
      type: data.type,
      port: data.port,
      command: data.command,
      id: ++id,
      opts: data.opts
    }))
  }

  const mw = ctx => next => action => {
    var dispatch = ctx.dispatch
    switch (action.type) {
      case WRITE:
        return writes.put(action.payload)
      case READ:
        return reads.take()
      case RUN:
        return dispatch(run(action.payload))
    }
    return next(action)
  }

  const dispatch = function (it) {
    return yoco(mw)(runAction(it))
  }

  dispatch.mw = mw

  return dispatch

  function run (it) {
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
    return it
  }
}

function stop () {
  _stop && _stop()
}
