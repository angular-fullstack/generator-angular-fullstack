# download [![Build Status](https://travis-ci.org/kevva/download.svg?branch=master)](https://travis-ci.org/kevva/download)

> Download and extract files effortlessly

## Install

```sh
$ npm install --save download
```

## Usage

If you're fetching an archive you can set `extract: true` in options and
it'll extract it for you.

```js
var Download = require('download');
var progress = require('download-status');

var download = new Download()
    .get('http://example.com/foo.zip', 'destFolder', { extract: true, strip: 1 })
    .get('http://example.com/bar.jpg', 'destFolder')
    .get({ url: 'http://example.com/bar.jpg', name: 'foobar.jpg' }, 'destFolder')
    .use(progress());

download.run(function (err, files) {
    if (err) {
        throw err;
    }

    console.log(files);
    //=> [{ url: http://example.com/foo.zip, contents: <Buffer 50 4b 03 ...> }, { ... }]
});
```

## API

### new Download(opts)

Creates a new `Download` instance. Options defined here will be applied to all 
downloads.

### .get(file, dest, opts)

Add a file to download. The `file` argument accepts a `String` containing a URL 
or an `Object` with a URL and a desired name. For example `{ url: http://example.com/file.zip, name: 'foo.zip' }`. If you don't supply a `dest` no files will be written to the disk.

Options defined here will only apply to the specified file.

### .use(plugin)

Adds a plugin to the middleware stack.

### .proxy(proxy)

Set proxy settings. Defaults to `process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy;`.

### .run(cb)

Downloads your files and returns an error if something has gone wrong.

## Options

You can define options accepted by the [request](https://github.com/mikeal/request#requestoptions-callback) 
module besides from the options below.

### extract

Type: `Boolean`  
Default: `false`

If set to `true`, try extracting the file using [decompress](https://github.com/kevva/decompress/).

### mode

Type: `Number`  
Default: `null`

Set mode on the downloaded file.

### strip

Type: `Number`  
Default: `0`

Equivalent to `--strip-components` for tar.

## License

MIT © [Kevin Mårtensson](http://kevinmartensson.com)
