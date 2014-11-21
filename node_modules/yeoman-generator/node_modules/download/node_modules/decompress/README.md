# decompress [![Build Status](https://travis-ci.org/kevva/decompress.svg?branch=master)](https://travis-ci.org/kevva/decompress)

> Easily extract archives

## Install

```sh
$ npm install --save decompress
```

## Usage

```js
var Decompress = require('decompress');

var decompress = new Decompress({ mode: 755 })
    .src('foo.zip')
    .dest('destFolder')
    .use(Decompress.zip({ strip: 1 }));

decompress.decompress(function (err) {
    if (err) {
        throw err;
    }

    console.log('Archive extracted successfully!');
});
```

## API

### new Decompress(opts)

Creates a new `Decompress` instance.

### .src(file)

Set the file to be extract. Can be a `Buffer` or the path to a file.

### .dest(path)

Set the destination to where your file will be extracted to.

### .use(plugin)

Add a `plugin` to the middleware stack.

### .decompress(cb)

Extract your file with the given settings.

## Options

### mode

Type: `Number`  
Default: `null`

Set mode on the extracted files.

## Plugins

The following [plugins](https://www.npmjs.org/browse/keyword/decompressplugin) are bundled with decompress:

* [tar](#tar) — Extract TAR files.
* [tar.gz](#targz) — Extract TAR.GZ files.
* [zip](#zip) — Extract ZIP files.

### .tar()

Extract TAR files.

```js
var Decompress = require('decompress');

var decompress = new Decompress()
    .use(Decompress.tar({ strip: 1 }));
```

### .targz()

Extract TAR.GZ files.

```js
var Decompress = require('decompress');

var decompress = new Decompress()
    .use(Decompress.targz({ strip: 1 }));
```

### .zip()

Extract ZIP files.

```js
var Decompress = require('decompress');

var decompress = new Decompress()
    .use(Decompress.zip({ strip: 1 }));
```

## CLI

```bash
$ npm install --global decompress
```

```sh
$ decompress --help

Usage
  $ decompress <file> [directory]

Example
  $ decompress --strip 1 file.zip out

Options
  -m, --mode     Set mode on the extracted files
  -s, --strip    Equivalent to --strip-components for tar
```

## License

MIT © [Kevin Mårtensson](http://kevinmartensson.com)
