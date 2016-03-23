var move = require('./move')
var WebSocket = require('ws')
var Emitter = require('component-emitter')
var channel = require('@f/channel')()
var curry = require('@f/curry-once')
var flob = require('flo-bind').default
var map = require('@f/map-obj')
var compose = require('@f/compose')
var createAction =require('@f/create-action')

module.exports = ev3

function ev3 (address) {
  var id = 0

  try {
    var ws = new WebSocket('ws://' + address)
  } catch (e) {
    console.warn(e)
  }

  ws.on('open', function () {
    ws.send(JSON.stringify({
      type: 'sensor_subscribe',
      id: 1
    }))
  })

  ws.on('message', function (data) {
    channel.put(JSON.parse(data))
  })

  function getStatus (data) {
    return read('sensors')
  }

  function write (data) {
    ws.send(JSON.stringify({
      type: data.type,
      ports: data.port,
      command: data.command,
      id: ++id,
      opts: data.opts
    }))
  }

  var run = flob(ctx => next => action => {
    switch (action.type) {
      case 'WRITE':
        write(action.payload)
        console.log(action.payload.opts.left.duty_cycle_sp)
        break
      case 'READ':
        return channel.take().then(val => {
          console.log(val.value.b)
          return val
        })
        break
    }
  })

  return {
    move: map((fn) => compose(run, fn), move('b', 'c'))
  }
}
