/**
 * Imports
 * @private
 */

var actions = require('./actions')
var read = actions.read
var writeAction = actions.write

/**
 * Vars
 * @private
 */

var MAX_SPEED = 800
var motorDefaults = {
  speed: 300,
  braking: 'brake',
  wait: false
}

/**
 * Expose MoveSteering
 * @private
 */

module.exports = motor

/**
 * [motor description]
 * @param  {string} port        port that the motor is connected to
 * @return {MoveFunctions}      An object of move functions
 */
function motor (port) {
  port = port || 'a'
  var write = writeAction('motor_write', port)

  /**
   * Run motor forever
   * @param  {Number} speed speed of motor
   * @param  {Object} opts  object of optional params
   */
  function * forever (speed, opts) {
    speed = speed || motorDefaults.speed
    speed = percentToSpeed(speed)

    yield write('run-forever', {
      'speed_sp': speed.toString()
    })
  }

  /**
   * Run motor for a number of degrees
   * @param  {Number} degrees degrees to turn motor
   * @param  {Number} speed   speed at which to turn motors
   */
  function * degrees (deg, speed) {
    speed = speed || motorDefaults.speed
    speed = percentToSpeed(speed)

    yield * writeAndWait('run-to-rel-pos', {
      'position_sp': deg.toString(),
      'speed_sp': speed.toString()
    })
  }

  /**
   * Run motor for a number of rotations
   * @param  {Number} rotations number of rotations to turn the motor
   * @param  {Number} speed     speed at which to turn motors
   */
  function * rotations (rots, speed) {
    speed = speed || motorDefaults.speed
    yield * this.degrees(Math.round(rots * 360), speed)
  }

  /**
   * Run drive motors for a specified amount of time
   * @param  {Number} time  time to run the motors for (in milliseconds)
   * @param  {Number} speed speed at which to turn motors
   */
  function * timed (time, speed) {
    speed = speed || motorDefaults.speed
    speed = percentToSpeed(speed)

    yield * writeAndWait('run-timed', {
      'time_sp': time.toString(),
      'speed_sp': speed.toString()
    })
  }

  /**
   * Stops motors
   */
  function * stop () {
    yield write('stop')
  }

 /**
  * Write and hold execution until the motor are done moving
  * @private
  * @param  {string} command move command
  * @param  {object} opts    move options
  */
  function * writeAndWait (command, opts) {
    var ran = false
    yield write(command, opts)
    while (true) {
      var devices = yield read()
      if (devices.motor(port) === 'running') {
        ran = true
      }
      if (devices.motor(port) === '' && ran) {
        break
      }
    }
  }

  /**
   * @typedef {object} MoveFunctions
   * @property {function} forever     {@link forever}
   * @property {function} degrees     {@link degrees}
   * @property {function} rotations   {@link rotations}
   * @property {function} timed       {@link timed}
   * @property {function} Stops       {@link stop}
   */
  return {
    forever: forever,
    degrees: degrees,
    rotations: rotations,
    timed: timed,
    stop: stop
  }
}

/**
 * Convert input to actual speed
 * @private
 * @param  {number} pct number to convert
 * @return {number}     converted number
 */
function percentToSpeed (pct) {
  return (MAX_SPEED * pct) / 100
}
