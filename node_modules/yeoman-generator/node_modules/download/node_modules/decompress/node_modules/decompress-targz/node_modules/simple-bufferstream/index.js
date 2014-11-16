const stream = require('stream')
    , util   = require('util')

var SimpleBufferStream = function (buffer) {
  var self = this
  stream.Stream.call(self)
  self._state  = 'ready'
  self._buffer = buffer
  process.nextTick(function () {
    self._dump()
  })
}

util.inherits(SimpleBufferStream, stream.Stream)

SimpleBufferStream.prototype._dump = function() {
  if (this._state != 'ready')
    return

  this._state = 'done'
  this.emit('data', this._buffer)
  this.emit('end')
  this.emit('close')
}

SimpleBufferStream.prototype.pause = function() {
  if (this._state != 'done')
    this._state = 'paused'
}
SimpleBufferStream.prototype.resume = function() {
  if (this._state == 'done')
    return
  this._state = 'ready'
  this._dump()
}

SimpleBufferStream.prototype.destroy = function() {}

module.exports = function (buffer) {
  return new SimpleBufferStream(buffer)
}
