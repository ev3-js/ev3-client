/**
 * Imports
 */

var defaults = require('@f/defaults')
var read = require('./read')

/**
 * Vars
 */

var motorDefaults = {
  speed: 300,
  braking: 'brake',
  wait: false
}

/**
 * Expose MoveSteering
 */

module.exports = move


function motor (port) {
  port = port || 'a'
  var write = require('./write')(motorWrite)

  /**
   * Run motors forever
   * @param  {Number} speed speed of motor
   * @param  {Object} opts  object of optional params
   */

  function * forever (speed, opts) {
    speed = speed || motorDefaults.speed

    yield write('run-forever', {
      'duty_cycle_sp': speeds.toString()
    })
  }

  /**
   * Run drive motors for a number of degrees
   * @param  {Number} degrees degrees to turn motor
   * @param  {Number} speed   speed at which to turn motors
   * @param  {Number} turn    turn direction
   */

  function * degrees (deg, speed) {
    speed = speed || motorDefaults.speed

    yield * writeAndWait('run-to-rel-pos', {
      'position_sp': deg.toString(),
      'duty_cycle_sp': speed.toString()
    })
  }

  /**
   * Run drive motors for a number of rotations
   * @param  {Number} rotations number of rotations to turn the motor
   * @param  {Number} speed     speed at which to turn motors
   * @param  {Number} turn      turn direction
   */

  function * rotations (rots, speed) {
    speed = speed || motorDefaults.speed
    yield * this.degrees(Math.round(rots * 360), speed)
  }

  /**
   * Run drive motors for a specified amount of time
   * @param  {Number} time  time to run the motors for (in milliseconds)
   * @param  {Number} speed speed at which to turn motors
   * @param  {Number} turn  turn direction
   */

  function * timed (time, speed) {
    speed = speed || motorDefaults.speed

    yield * writeAndWait('run-timed', {
      'time_sp': time.toString(),
      'duty_cycle_sp': speed.toString()
    })
  }

  /**
   * Stops motors
   */

  function * stop () {
    yield write('stop')
  }

  /**
   * Reset motors
   */

  function * reset () {
    yield write('reset')
  }

  function * writeAndWait (command, opts) {
    var ran = false
    yield write(command, opts)
    while (true) {
      var devices = yield read()
      if (devices.motor(port) === 'running') {
        ran = true
      }
      if (devices.motor(port) === '') {
        break
      }
    }
  }

  function motorWrite (command, opts) {
    return {
      type: 'motor_write',
      command: command,
      opts: opts,
      port: port
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