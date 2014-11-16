# decompress-tar [![Build Status](https://travis-ci.org/kevva/decompress-tar.svg?branch=master)](https://travis-ci.org/kevva/decompress-tar)

> tar decompress plugin

## Install

```sh
$ npm install --save decompress-tar
```

## Usage

```js
var Decompress = require('decompress');
var tar = require('decompress-tar');

var decompress = new Decompress()
    .src('foo.tar')
    .dest('destFolder')
    .use(tar({ strip: 1 }));

decompress.decompress();
```

## Options

### strip

Type: `Number`  
Default: `0`

Equivalent to `--strip-components` for tar.

## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
