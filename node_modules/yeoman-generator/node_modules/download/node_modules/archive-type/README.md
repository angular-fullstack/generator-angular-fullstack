# archive-type [![Build Status](https://travis-ci.org/kevva/archive-type.svg?branch=master)](https://travis-ci.org/kevva/archive-type)

> Detect the archive type of a Buffer/Uint8Array


## Install

```sh
$ npm install --save archive-type
```

## Usage

```js
var archiveType = require('archive-type');
var read = require('fs').readFileSync;

archiveType(read('foo.zip'));
// => zip
```


## API

### archiveType(buf)

Returns [`7z`](https://github.com/kevva/is-7zip), [`bz2`](https://github.com/kevva/is-bzip2), [`gz`](https://github.com/kevva/is-gzip), [`rar`](https://github.com/kevva/is-rar), [`tar`](https://github.com/kevva/is-tar), [`zip`](https://github.com/kevva/is-zip) or `false`.

#### buf

Type: `buffer` *(Node.js)*, `uint8array`

It only needs the first 261 bytes.

## CLI

```sh
$ npm install --global archive-type
```

```sh
$ archive-type --help

Usage
  $ archive-type <file>
  $ cat <file> | archive-type

Example
  $ archive-type foo.tar.gz
  $ cat foo.tar.gz | archive-type
```


## License

MIT © [Kevin Mårtensson](https://github.com/kevva)
