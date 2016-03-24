module.exports = read

function * read () {
  var vals = yield { type: 'READ' }
  var sensors = vals.value

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
        throw new Error('No device found in that port')
      }
      if (sensors[port].type !== name) {
        throw new Error('Port does not match type')
      }
      return sensors[port].value
    }
  }
}
