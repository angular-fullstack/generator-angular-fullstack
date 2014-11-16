var tape   = require('tape')
  , fs     = require('fs')
  , bl     = require('bl')
  , bogan  = require('boganipsum')
  , rimraf = require('rimraf')
  , sbuff  = require('./')

tape('test simple concat', function (t) {
  var inp = new Buffer(bogan())

  sbuff(inp).pipe(
    bl(function (err, body) {
      t.notOk(err, 'no error')

      t.equals(body.toString(), inp.toString(), 'output = input')
      t.end()
    })
  )
})

tape('test against fs write-stream', function (t) {
  var inp = new Buffer(bogan())
    , f   = '$$.test.$$'

  sbuff(inp)
    .pipe(fs.createWriteStream(f))
    .on('error', function (err) {
      t.fail(err)
      rimraf(f, t.end.bind(t))
    })
    .on('close', function () {
      var outp = fs.readFileSync(f)
      t.equals(outp.toString(), inp.toString(), 'output = input')
      rimraf(f, t.end.bind(t))
    })
})


tape('test pause & resume', function (t) {
  var inp    = new Buffer(bogan())
    , stream = sbuff(inp)
    , blstream

  stream.pipe(
    blstream = bl(function (err, body) {
      t.notOk(err, 'no error')
      t.equals(body.toString(), inp.toString(), 'output = input')
      t.end()
    })
  )

  stream.pause()

  setTimeout(function () {
    t.equal(blstream.length, 0, 'nothing in concat-stream, stream is paused')
    stream.resume()
  }, 100)
})