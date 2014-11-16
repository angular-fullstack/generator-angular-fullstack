# Simple BufferStream [![Build Status](https://secure.travis-ci.org/rvagg/node-simple-bufferstream.png)](http://travis-ci.org/rvagg/node-simple-bufferstream)

Give it a Node.js Buffer and it'll give you a Node.js Readable Stream; that's all!

If you need anything fancier then use [BufferStream](https://github.com/dodo/node-bufferstream), it does splitting and the whole kitchen sink!

A contrived example:

```js
var sbuff = require('simple-bufferstream')

sbuff(myBuffer).pipe(fs.createWriteStream('myoutput.dat'))
```

Not that you'd want to do exactly that but sometimes you need a Buffer to behave as a Stream.

## Licence

Simple BufferStream is Copyright (c) 2012 Rod Vagg [@rvagg](https://twitter.com/rvagg) and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.