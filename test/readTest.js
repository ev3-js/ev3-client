var test = require('tape')
var read = require('../lib/read')

var sensorData = {
  value: {
    a: {
      type: 'lego-ev3-us',
      value: '50'
    },
    b: {
      type: 'lego-ev3-touch',
      value: '1'
    },
    c: {
      type: 'lego-ev3-color',
      value: '5'
    }
  }

}

test('read test', function (t) {
  var it = read()
  t.deepEqual(it.next().value, {type: 'READ'})
  var devices = it.next(sensorData).value
  t.equal(devices.sonic('a'), sensorData.value.a.value)
  t.equal(devices.touch('b'), sensorData.value.b.value)
  t.equal(devices.color('c'), sensorData.value.c.value)
  t.throws(() => devices.touch('c'))
  t.throws(() => devices.sonic('b'))
  t.throws(() => devices.color('a'))
  t.end()
})
