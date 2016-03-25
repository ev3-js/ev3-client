var test = require('tape')
var WS = require('ws').Server
var port = 3000
var server = new WS({port: port})
var ev3 = require('../lib/index')

setTimeout(function () {
  var run = ev3.robot('localhost')
  run(function * () {
    yield ev3.move().timed(2000, 50, 50)
    yield ev3.move().rotations(1, 50, 50)
  })

  ws.onerror = function (err) {
    console.log(err)
  }
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
  socket.on('message', function (msg) {
    console.log(msg)
  })

  var interval = startRun(socket)
  setTimeout(function () {
    clearInterval(interval)
    setInterval(function () {
      socket.send(JSON.stringify({
        type: 'sensor_read',
        value: {
          'b': {
            type: 'motor',
            value: ''
          },
          'c': {
            type: 'motor',
            value: ''
          },
          '1': {
            type: 'touch',
            value: '0'
          }
        }
      }))
    })
  }, 4000)
})
