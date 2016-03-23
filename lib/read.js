module.exports = read

function * read () {
  var vals = yield { type: 'READ' }

  return {
    motor: getValue('motor'),
    sonic: getValue('sonic'),
    touch: getValue('touch'),
    color: getValue('color'),
    ir: getValue('ir')
  }

  function getValue (name) {
    return function (port) {
      if (!vals[port]) {
        throw new Error('No device found in that port')
      }

      var deviceName = typeToDevice(vals[port].type)
      if (deviceName !== name) {
        throw new Error('Port does not match type')
      }

      return vals[port].value
    }
  }
}

function typeToDevice (type) {
  var types = {
    'lego-ev3-l-motor': 'motor',
    'lego-ev3-m-motor': 'motor',
    'lego-nxt-motor': 'motor',
    'lego-ev3-us': 'sonic',
    'lego-ev3-touch': 'touch',
    'lego-ntx-touch': 'touch',
    'lego-ev3-color': 'color',
    'lego-ev3-ir': 'ir'
  }
  return types[type]
}
