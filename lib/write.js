var createAction = require('@f/create-action')

module.exports = function (payloadCreator, metaCreator) {
  return createAction('WRITE', payloadCreator, metaCreator)
}
