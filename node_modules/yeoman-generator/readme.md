# Generator [![Build Status](https://secure.travis-ci.org/yeoman/generator.svg?branch=master)](http://travis-ci.org/yeoman/generator) [![Coverage Status](https://coveralls.io/repos/yeoman/generator/badge.png)](https://coveralls.io/r/yeoman/generator)

> A Rails-inspired generator system that provides scaffolding for your apps.


### [Getting Started](http://yeoman.io/authoring/getting-started.html)&nbsp;&nbsp;&nbsp;[API Documentation](http://yeoman.github.io/generator/)


![Generator output](https://img.skitch.com/20120923-jxbn2njgk5dp7ttk94i1tx9ek2.png)

![Generator diff](https://img.skitch.com/20120922-kpjs68bgkshtsru4cwnb64fn82.png)


## Getting Started

If you're interested in writing your own Yeoman generator we recommend reading [the official getting started guide](http://yeoman.io/authoring/).

There are typically two types of generators - simple boilerplate 'copiers' and more advanced generators which can use custom prompts, remote dependencies, wiring and much more.

The docs cover how to create generators from scratch as well as recommending command-line generators for making other generators.

For deeper research, read the code source or visit our [API documentation](http://yeoman.github.io/generator/).


### Debugging

To debug a generator, you can pass Node.js debug's flags by running it like this:

```sh
# OS X / Linux
node --debug `which yo` <generator> [arguments]

# Windows
node --debug <path to yo binary> <generator> [arguments]
```

Yeoman generators also use a debug mode to log relevant informations. You can activate it by setting the `DEBUG` environment variable to the desired scope (for the generator system scope is `generators:*`).

```sh
# OS X / Linux
DEBUG=generators/*

# Windows
set DEBUG=generators/*
```


## License

[BSD license](http://opensource.org/licenses/bsd-license.php)
Copyright (c) Google
