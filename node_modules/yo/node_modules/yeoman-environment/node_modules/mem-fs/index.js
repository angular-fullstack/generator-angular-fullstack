'use strict';
var path = require('path');
var vinylFile = require('vinyl-file');
var File = require('vinyl');
var through = require('through2');

exports.create = function () {
  var store = {};

  function load(filepath) {
    var file;
    try {
      file = vinylFile.readSync(filepath);
    } catch (err) {
      file = new File({
        cwd: process.cwd(),
        base: path.basename(filepath),
        path: filepath,
        contents: null
      });
    }
    store[filepath] = file;
    return file;
  }

  return {
    get: function (filepath) {
      filepath = path.resolve(filepath);
      return store[filepath] || load(filepath);
    },

    add: function (file) {
      store[file.path] = file;
      return this;
    },

    each: function (onEach) {
      Object.keys(store).forEach(function (key, index) {
        onEach(store[key], index);
      });
      return this;
    },

    stream: function () {
      var stream = through.obj();
      setImmediate(function () {
        this.each(stream.write.bind(stream));
        stream.end();
      }.bind(this));
      return stream;
    }
  };
};
