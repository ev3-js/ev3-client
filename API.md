# degrees

[lib/motor.js:57-65](https://github.com/ev3-js/ev3-client/blob/21351435daced107b183304fac74a8f859107e8b/lib/motor.js#L57-L65 "Source code on GitHub")

Run motor for a number of degrees

**Parameters**

-   `degrees` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** degrees to turn motor
-   `deg`  
-   `speed` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** speed at which to turn motors

# forever

[lib/motor.js:43-50](https://github.com/ev3-js/ev3-client/blob/21351435daced107b183304fac74a8f859107e8b/lib/motor.js#L43-L50 "Source code on GitHub")

Run motor forever

**Parameters**

-   `speed` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** speed of motor
-   `opts` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** object of optional params

# motor

[lib/motor.js:34-134](https://github.com/ev3-js/ev3-client/blob/21351435daced107b183304fac74a8f859107e8b/lib/motor.js#L34-L134 "Source code on GitHub")

[motor description]

**Parameters**

-   `port` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** port that the motor is connected to

Returns **MoveFunctions** An object of move functions

# MoveFunctions

[lib/motor.js:127-133](https://github.com/ev3-js/ev3-client/blob/21351435daced107b183304fac74a8f859107e8b/lib/motor.js#L127-L133 "Source code on GitHub")

**Properties**

-   `forever` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** `forever`
-   `degrees` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** `degrees`
-   `rotations` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** `rotations`
-   `timed` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** `timed`
-   `Stops` **[function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** `stop`

# rotations

[lib/motor.js:72-75](https://github.com/ev3-js/ev3-client/blob/21351435daced107b183304fac74a8f859107e8b/lib/motor.js#L72-L75 "Source code on GitHub")

Run motor for a number of rotations

**Parameters**

-   `rotations` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** number of rotations to turn the motor
-   `rots`  
-   `speed` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** speed at which to turn motors

# stop

[lib/motor.js:95-97](https://github.com/ev3-js/ev3-client/blob/21351435daced107b183304fac74a8f859107e8b/lib/motor.js#L95-L97 "Source code on GitHub")

Stops motors

# timed

[lib/motor.js:82-90](https://github.com/ev3-js/ev3-client/blob/21351435daced107b183304fac74a8f859107e8b/lib/motor.js#L82-L90 "Source code on GitHub")

Run drive motors for a specified amount of time

**Parameters**

-   `time` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** time to run the motors for (in milliseconds)
-   `speed` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** speed at which to turn motors
