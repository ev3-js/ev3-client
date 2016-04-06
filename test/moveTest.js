var test = require('tape')
var move = require('../lib/move')('b', 'c')
var actions = require('../lib/actions')
var WRITE = actions.WRITE
var READ = actions.READ

test('forever', function (t) {
  var s = '50'
  var it = move.forever(s, 0)
  t.deepEqual(it.next().value, moveObj('run-forever', forever('400')))
  t.equal(it.next().done, true)
  t.end()
})

test('stop', function (t) {
  var it = move.stop()
  t.deepEqual(it.next().value, moveObj('stop', {left: {}, right: {}}))
  t.equal(it.next().done, true)
  t.end()
})

test('reset', function (t) {
  var it = move.reset()
  t.deepEqual(it.next().value, moveObj('reset', {left: {}, right: {}}))
  t.equal(it.next().done, true)
  t.end()
})

test('degrees', function (t) {
  var p = '500'
  var speed = '50'
  var it = move.degrees(p, speed, 0)
  t.deepEqual(it.next().value, moveObj('run-to-rel-pos', position(p, '400')))
  t.deepEqual(it.next().value, {type: READ})
  t.deepEqual(it.next(runningReadOut).value, {type: READ})
  t.equal(it.next(doneReadOut).done, true)
  t.end()
})

test('rotations', function (t) {
  var speed = '400'
  var it = move.rotations(1, 50, 0)
  t.deepEqual(it.next().value, moveObj('run-to-rel-pos', position('360', speed)))
  t.deepEqual(it.next().value, {type: READ})
  t.deepEqual(it.next(runningReadOut).value, {type: READ})
  t.equal(it.next(doneReadOut).done, true)
  t.end()
})

test('timed', function (t) {
  var ms = '1000'
  var s = '50'
  var it = move.timed(ms, s, 0)
  t.deepEqual(it.next().value, moveObj('run-timed', time(ms, '400')))
  t.deepEqual(it.next().value, {type: READ})
  t.deepEqual(it.next(runningReadOut).value, {type: READ})
  t.equal(it.next(doneReadOut).done, true)
  t.end()
})

function position (position, speed) {
  return {
    left: {
      'position_sp': position,
      'speed_sp': speed
    },
    right: {
      'position_sp': position,
      'speed_sp': speed
    }
  }
}

function forever (s) {
  return {
    left: {
      'speed_sp': s
    },
    right: {
      'speed_sp': s
    }
  }
}

function time (t, speed) {
  return {
    left: {
      'time_sp': t,
      'speed_sp': speed
    },
    right: {
      'time_sp': t,
      'speed_sp': speed
    }
  }
}

function moveObj (command, opts) {
  return {
    type: WRITE,
    payload: {
      type: 'motors_write',
      command: command,
      port: ['b', 'c'],
      opts: opts
    },
    meta: undefined
  }
}

var runningReadOut = {
  value: {
    'b': {
      type: 'motor',
      value: 'running'
    },
    'c': {
      type: 'motor',
      value: 'running'
    }
  }
}

var doneReadOut = {
  value: {
    'b': {
      type: 'motor',
      value: ''
    },
    'c': {
      type: 'motor',
      value: ''
    }
  }
}
