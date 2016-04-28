/*
 * Constants
 */
const RUN = 'ev3-client/RUN'
const WRITE = 'ev3-client/WRITE'
const READ = 'ev3-client/READ'
var createAction = require('@f/create-action')
var mapObj = require('@f/map-obj')
var isObject = require('@f/is-object')

/**
 * run action creator
 * @private
 * @param  {function} it     generator function
 * @return {object}          action
 */
function runAction (it) {
  return {
    type: RUN,
    payload: it
  }
}

/**
 * read values from the sensor
 * @private
 * @return {ReadFunctions} -
 *         Functions for reading the motor and sensor data
 */
function * read () {
  var vals = yield {
    type: READ
  }
  var sensors = vals.value

  /**
   * @typedef {object} ReadFunctions
   * @private
   * @property {function} motor Get the state of the motor
   * @property {function} sonic Get the distance measured from the ultrasonic sensor
   * @property {function} touch Get the value from the touch sensors
   * @property {function} color Get the value of the color sensors
   * @property {function} ir Get the value of the infrared sensor
   */
  return {
    motor: getValue('motor'),
    sonic: getValue('sonic'),
    touch: getValue('touch'),
    color: getValue('color'),
    ir: getValue('ir')
  }

  function getValue (name) {
    return function (port) {
      if (!sensors[port]) {
        throw new Error(`No device found in port: ${port}`)
      }
      if (sensors[port].type !== name) {
        throw new Error(`Port ${port} does not match type ${name}`)
      }
      if (isObject(sensors[port].value)) {
        return mapObj((val) => Number(val), sensors[port].value)
      }
      return name === 'motor' ? sensors[port].value : Number(sensors[port].value)
    }
  }
}

/**
 * curried function to return a write action creator
 * @private
 * @param  {string} type The type of write command
 * @param  {string|array} port The port or ports that write action corresponds to
 * @return {function} {@link writeCommand}
 */
function write (type, port) {
  return createAction(WRITE, writeCommand)

  /**
   * function that returns a write actions
   * @private
   * @param  {string} command
   * @param  {object} opts    move object
   * @return {object}         write action object
   */
  function writeCommand (command, opts) {
    return {
      type: type,
      command: command,
      opts: opts,
      port: port
    }
  }
}

module.exports = {
  RUN: RUN,
  WRITE: WRITE,
  READ: READ,

  runAction: runAction,
  write: write,
  read: read
}
