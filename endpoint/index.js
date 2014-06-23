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
  if(this.config.get('insertRoutes')) {
    var config = {
      file: this.config.get('registerRoutesFile'),
      needle: this.config.get('routesNeedle'),
      splicable: [
        "app.use(\'/api/" + this.name + "\', require(\'./api/" + this.name + "\'));"
      ]
    };
    ngUtil.rewriteFile(config);
  }

  if (this.filters.socketio) {
    if(this.config.get('insertSockets')) {
      var config = {
        file: this.config.get('registerSocketsFile'),
        needle: this.config.get('socketsNeedle'),
        splicable: [
          "require(\'./api/" + this.name + '/' + this.name + ".socket\').register(socket);"
        ]
      };
      ngUtil.rewriteFile(config);
    }
  }
};

Generator.prototype.createFiles = function createFiles() {
  var dest = this.config.get('endpointDirectory') || 'server/api/' + this.name;
  this.sourceRoot(path.join(__dirname, './templates'));
  ngUtil.processDirectory(this, '.', dest);
};