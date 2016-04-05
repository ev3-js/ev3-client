/**
 * Imports
 */

var actions = require('./actions')
var read = actions.read
var writeAction = actions.write

/**
 * Vars
 */

var motorDefaults = {
  speed: 300,
  braking: 'brake',
  wait: false
}
var MAX_SPEED = 800

/**
 * Expose move
 */

module.exports = move


function move (leftPort, rightPort) {
  leftPort = leftPort || 'b'
  rightPort = rightPort || 'c'
  var write = writeAction('motors_write', [leftPort, rightPort])
  /**
   * Run motors forever
   * @param  {Number} speed speed of motor
   * @param  {Object} opts  object of optional params
   */

  function * forever (speed, turn, opts) {
    speed = speed || motorDefaults.speed
    var speeds = turnToSpeeds(turn, speed)

    yield write('run-forever', {
      left: {
        'speed_sp': speeds.left.toString()
      }, right: {
        'speed_sp': speeds.right.toString()
      }
    })
  }

  /**
   * Run drive motors for a number of degrees
   * @param  {Number} degrees degrees to turn motor
   * @param  {Number} speed   speed at which to turn motors
   * @param  {Number} turn    turn direction
   */

  function * degrees (deg, speed, turn) {
    speed = speed || motorDefaults.speed

    var opts = turnToDegrees(turn, speed, deg)
    yield * writeAndWait('run-to-rel-pos', {
      left: {
        'position_sp': opts.left.degrees.toString(),
        'speed_sp': opts.left.speed.toString()
      },
      right: {
        'position_sp': opts.right.degrees.toString(),
        'speed_sp': opts.right.speed.toString()
      }
    })
  }

  /**
   * Run drive motors for a number of rotations
   * @param  {Number} rotations number of rotations to turn the motor
   * @param  {Number} speed     speed at which to turn motors
   * @param  {Number} turn      turn direction
   */

  function * rotations (rots, speed, turn) {
    speed = speed || motorDefaults.speed
    yield * this.degrees(Math.round(rots * 360), speed, turn)
  }

  /**
   * Run drive motors for a specified amount of time
   * @param  {Number} time  time to run the motors for (in milliseconds)
   * @param  {Number} speed speed at which to turn motors
   * @param  {Number} turn  turn direction
   */

  function * timed (time, speed, turn) {
    speed = speed || motorDefaults.speed

    var speeds = turnToSpeeds(turn, speed)
    yield * writeAndWait('run-timed', {
      left: {
        'time_sp': time.toString(),
        'speed_sp': speeds.left.toString()
      },
      right: {
        'time_sp': time.toString(),
        'speed_sp': speeds.right.toString()
      }
    })
  }

  /**
   * Stops motors
   */

  function * stop () {
    yield write('stop', {left: {}, right: {}})
  }

  /**
   * Reset motors
   */

  function * reset () {
    yield write('reset', {left: {}, right: {}})
  }

  function * writeAndWait (command, opts) {
    var ran = false
    yield write(command, opts)
    while (true) {
      var devices = yield * read()
      if (devices.motor(leftPort) === 'running' || devices.motor(rightPort) === 'running') {
        ran = true
      }
      if (devices.motor(leftPort) === '' && devices.motor(rightPort) === '' && ran) {
        break
      }
    }
  }

  return {
    forever: forever,
    degrees: degrees,
    rotations: rotations,
    timed: timed,
    stop: stop,
    reset: reset
  }
}

/**
 * Convert turn in to left and right speeds
 * @param  {Number} turn  -100 to 100
 * @param  {Number} speed
 * @return {Object}
 */

function turnToSpeeds (turn, speed) {
  turn = Math.max(Math.min(turn, 100), -100)

  var reducedSpeed = otherSpeed(turn, speed)
  reducedSpeed = percentToSpeed(reducedSpeed)
  speed = percentToSpeed(speed)

  return {
    left: turn < 0 ? reducedSpeed : speed,
    right: turn > 0 ? reducedSpeed : speed
  }
}

/**
 * Params for degrees based on turn
 * @param  {Number} turn
 * @param  {Number} speed
 * @param  {Number} degrees
 * @return {Object} opts    object of degrees and speed for each motor
 */

function turnToDegrees (turn, speed, degrees) {
  turn = Math.max(Math.min(turn, 100), -100)

  var opts = turnToSpeeds(turn, speed)
  opts.left = { speed: opts.left }
  opts.right = { speed: opts.right }

  var reducedSpeed = otherSpeed(turn, speed)
  var reducedDegrees = Math.round((reducedSpeed / speed) * degrees)

  opts.left.degrees = turn < 0 ? reducedDegrees : degrees
  opts.right.degrees = turn > 0 ? reducedDegrees : degrees

  return opts
}

/**
 * Calculate off wheel speed
 * @param  {Number} turn
 * @param  {Number} speed
 * @return {Number} speed of the off motor
 */

function otherSpeed (turn, speed) {
  return Math.round(speed * ((100 - (Math.abs(turn) * 2)) / 100))
}

function percentToSpeed (pct) {
  return (MAX_SPEED * pct) / 100
}
