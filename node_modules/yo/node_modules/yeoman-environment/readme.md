# Yeoman Environment [![Build Status](https://secure.travis-ci.org/yeoman/generator.svg?branch=master)](http://travis-ci.org/yeoman/environment) [![Coverage Status](https://coveralls.io/repos/yeoman/environment/badge.png)](https://coveralls.io/r/yeoman/environment)

Yeoman Environment is responsible of handling the lifecyle and bootstrap of generators in a specific environment (your app).

It provides a high-level API to discover, create and run generators, as well as further tuning where and how a generator is resolved.

## Usage

```js
var yeoman = require('yeoman-environment');

var env = yeoman.createEnv();

// The #lookup() method will search the user computer for installed generators. The search
// if done from the current working directory.
env.lookup(function () {
  env.run('angular', { 'skip-install': true }, done);
});
```

For advance usage, see [our API documentation](http://yeoman.github.io/environment)

## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
