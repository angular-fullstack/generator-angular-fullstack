'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var util = require('util');
var ngUtil = require('../util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.registerEndpoint = function() {
  var config = {
    file: 'server/config/routes.js',
    needle: '// Use component routing',
    splicable: [
      "app.use(\'/api/" + this.name + "\', require(\'./api/" + this.name + "\'));"
    ]
  };
  ngUtil.rewriteFile(config);

  if(this.filters.socketio) {
    var config = {
      file: 'server/config/socketio.js',
      needle: '// Register listeners for components',
      splicable: [
        "require(\'./api/" + this.name + '/' + this.name + ".socket\').register(socket);"
      ]
    };
    ngUtil.rewriteFile(config);
  }
};

Generator.prototype.createFiles = function createFiles() {
  var dest = this.config.get('endpointDirectory') || 'server/api/' + this.name;
  this.sourceRoot(path.join(__dirname, './templates'));
  ngUtil.processDirectory(this, '.', dest);
};