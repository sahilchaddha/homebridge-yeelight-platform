const EventEmitter = require('events')

class MyEmitter extends EventEmitter { }
const emitter = new MyEmitter()
emitter.setMaxListeners(20)
module.exports = emitter
