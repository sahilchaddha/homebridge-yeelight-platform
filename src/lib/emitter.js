const EventEmitter = require('events')

class MyEmitter extends EventEmitter { }
const emitter = new MyEmitter()
module.exports = emitter
