var test = require('tape')
var WS = require('ws').Server
var port = 5000
var server = new WS({port: port})
var ev3 = require('../lib/index')

setTimeout(function () {
  var run = ev3.robot('localhost')
  run(function * () {
    yield ev3.move().timed(5000, 30, 0)
    console.log('shouldnt happen')
  })
  run(function * () {
    yield ev3.move().timed(5000, 30, 0)
    console.log('shouldnt happen')
  })
}, 1000)

function startRun (socket) {
  return setInterval(function () {
      socket.send(JSON.stringify({
        type: 'sensor_read',
        value: {
          'b': {
            type: 'motor',
            value: 'running'
          },
          'c': {
            type: 'motor',
            value: 'running'
          },
          '1': {
            type: 'touch',
            value: '0'
          },
          '2': {
            type: 'color',
            value: 5
          }
        }
      }))
    }, 150)
}

server.on('connection', function (socket) {
  var interval = startRun(socket)
  setTimeout(function () {
    clearInterval(interval)
  }, 4000)
})
