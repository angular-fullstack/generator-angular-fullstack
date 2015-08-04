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

Generator.prototype.askFor = function askFor() {
  var done = this.async();
  var name = this.name;

  var base = this.config.get('routesBase') || '/api/';
  if (base.charAt(base.length - 1) !== '/') {
    base = base + '/';
  }

  // pluralization defaults to true for backwards compat
  if (this.config.get('pluralizeRoutes') !== false) {
    name = name + 's';
  }

  var prompts = [
    {
      name: 'route',
      message: 'What will the url of your endpoint be?',
      default: base + name
    }
  ];

  this.prompt(prompts, function (props) {
    if (props.route.charAt(0) !== '/') {
      props.route = '/' + props.route;
    }

    this.route = props.route;
    done();
  }.bind(this));
};

Generator.prototype.registerEndpoint = function registerEndpoint() {
  if (this.config.get('insertRoutes')) {
    var routeConfig = {
      file: this.config.get('registerRoutesFile'),
      needle: this.config.get('routesNeedle'),
      splicable: [
        "app.use(\'" + this.route + "\', require(\'./api/" + this.name + "\'));"
      ]
    };
    ngUtil.rewriteFile(routeConfig);

    var rolesConfig = {
      file: this.config.get('configRolesFile'),
      needle: this.config.get('configRolesNeedle'),
      splicable: [
        "'" + this.name + "s-index', '" + this.name + "s-show', '" + this.name + "s-update', '" + this.name + "s-create', '" + this.name + "s-destroy',"
      ]
    };
    ngUtil.rewriteFile(rolesConfig);
  }
};

Generator.prototype.createFiles = function createFiles() {
  var dest = this.config.get('endpointDirectory') || 'server/api/' + this.name;
  this.sourceRoot(path.join(__dirname, './templates'));
  ngUtil.processDirectory(this, '.', dest);

  var destSharedModels = 'shared/models';
  this.sourceRoot(path.join(__dirname, './templatesJson/'));
  ngUtil.processDirectory(this, '.', destSharedModels);
};
