# fullname [![Build Status](https://travis-ci.org/sindresorhus/fullname.svg?branch=master)](https://travis-ci.org/sindresorhus/fullname)

> Get the fullname of the current user


## Install

```sh
$ npm install --save fullname
```

Tested on OS X, Linux and Windows.


## Usage

```js
var fullname = require('fullname');

fullname(function (err, name) {
	console.log(name);
	//=> Sindre Sorhus
});
```

In the rare case a name can't be found you could fall back to [`username`](https://github.com/sindresorhus/username).


## CLI

```sh
$ npm install --global fullname
```

```sh
$ fullname --help

  Example
    fullname
    Sindre Sorhus
```


## Related

See [username](https://github.com/sindresorhus/username) to get the username of the current user.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
