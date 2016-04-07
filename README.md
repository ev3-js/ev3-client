# ev3-client
Client for rtm-api

## Installation
```js
npm install ev3-client
```

## Usage
```js
let {robot, move, read, sleep, motor} = require('ev3-client') //expose ev3-client methods
var run = robot('ip address of websocket server') // connect to robot

var steer = move('b', 'c') // set drive motors to ports b and c
var motor1 = motor('a') // set arm motor to port a

run(function * () {
  var devices = yield read() // read sensor data
  var dist = devices.sonic(1) // get distance reading from ultrasonic sensor in port 1

  if (dist < 10) {
    yield steer.rotations(-1, 40, 0) // move one rotation backward
  } else {
    yield steer.rotations(1, 40, 0) // move one rotation forward
  }
  yield sleep(1000) // wait for 1 second
  yield motor1.degrees(90, 40) // spin motor in port a 90 degrees
})
```

## API
### robot(str)

- `str` - string containing the ip address of the [ev3 server](http://github.com/ev3-js/ev3-server)

**Returns** a runner for ev3 actions

### move(leftPort, rightPort)

- `leftPort` - port letter of the left motor. defaults to 'b'.
- `rightPort` - port letter of the right motor. defaults to 'c'.

**Returns:** object of move functions

##### .forever(speed, turn)
Run both motors until they receive a stop command.

- `speed` - number between 0 and 100 to control the speed at which to run the motors
- `turn` - number between -100 and 100 to denote amount of turning. -100 is maximum left turn. 0 is straight. 100 is maximum right turn.

##### .degrees(degrees, speed, turn)
Run both motors for a number of degrees with the ability to turn.

- `degrees` - number of degrees for the motor to spin
- `speed` - number between 0 and 100 to control the speed at which to run the motors
- `turn` - number between -100 and 100 to denote amount of turning. -100 is maximum left turn. 0 is straight. 100 is maximum right turn.

##### .rotations(rotations, speed, turn)
Run both motors with a number of degrees the ability to turn.

- `rotations` - number of rotations for the motor to spin
- `speed` - number between 0 and 100 to control the speed at which to run the motors
- `turn` - number between -100 and 100 to denote amount of turning. -100 is maximum left turn. 0 is straight. 100 is maximum right turn.

##### .timed(time, speed, turn)
Run both motor for a specified amount of time.

  - `time` - time in milliseconds
  - `speed` - number between 0 and 100 to control the speed at which to run the motors
  - `turn` - number between -100 and 100 to denote amount of turning. -100 is maximum left turn. 0 is straight. 100 is maximum right turn.

##### .stop()
Stop both motors.

##### .reset()
Stop and reset both motors.

### read()
Read the data from all devices connected to the robot

**Returns** Object to access sensor data

##### .touch(port)
Reads the state of the touch sensor

- `port` - the port the touch sensor is plugged in to

**Return** Number

value | meaning
---|---
0 | Not pressed
1 | Pressed

##### .sonic(port)
Reads the value of the ultrasonic sensor (defaults to inches)

- `port` - the port the touch sensor is plugged in to

**Returns** Number

##### .color(port)
Reads the value of the color sensor (defaults to color)

- `port` - the port the touch sensor is plugged in to

**Returns** Number

value | meaning
---|---
0 | no color
1 | black
2 | blue
3 | green
4 | yellow
5 | red
6 | white
7 | brown

##### .ir(port)
Reads the value of the infrared sensor (defaults to seek mode)

- `port` - the port the touch sensor is plugged in to

**Returns** Object
```
{
  heading1: heading towards beacon with channel 1,
  distance1: distance towards beacon with channel 1,
  heading2: heading towards beacon with channel 2,
  distance2: distance towards beacon with channel 2
}
```
##### .motor(port)
Read the state of the motor

- `port` - the port the motor is plugged in to

### motor(port)

- `port` - port letter of the motor. defaults to 'a'.

**Returns:** object of move functions

```
These function are exactly the same as the motors function but without the turn parameter.
```

### sleep(ms)
Pause execution for an amount of time

- `ms` - Time to pause execution in milliseconds

## license
MIT
