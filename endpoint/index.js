'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var util = require('util');
var ngUtil = require('../util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  this.option('route', {
    desc: 'URL for the endpoint',
    type: String
  });

  this.option('models', {
    desc: 'Specify which model(s) to use',
    type: String
  });

  this.option('endpointDirectory', {
    desc: 'Parent directory for enpoints',
    type: String
  });
};

util.inherits(Generator, ScriptBase);

Generator.prototype.prompting = function askFor() {
  var done = this.async();
  var promptCb = function (props) {
    if(props.route.charAt(0) !== '/') {
      props.route = '/' + props.route;
    }

    this.route = props.route;

    if (props.models) {
      delete this.filters.mongoose;
      delete this.filters.mongooseModels;
      delete this.filters.sequelize;
      delete this.filters.sequelizeModels;

      this.filters[props.models] = true;
      this.filters[props.models + 'Models'] = true;
    }
    done();
  }.bind(this);

  if (this.options.route) {
    if (this.filters.mongoose && this.filters.sequelize) {
      if (this.options.models) {
        return promptCb(this.options);
      }
    } else {
      if (this.filters.mongooseModels) { this.options.models = 'mongoose'; }
      else if (this.filters.sequelizeModels) { this.options.models = 'sequelize'; }
      else { delete this.options.models; }
      return promptCb(this.options);
    }
  }

  var name = this.name;

  var base = this.config.get('routesBase') || '/api/';
  if(base.charAt(base.length-1) !== '/') {
    base = base + '/';
  }

  // pluralization defaults to true for backwards compat
  if (this.config.get('pluralizeRoutes') !== false) {
    name = name + 's';
  }

  var self = this;
  var prompts = [
    {
      name: 'route',
      message: 'What will the url of your endpoint be?',
      default: base + name
    },
    {
      type: 'list',
      name: 'models',
      message: 'What would you like to use for the endpoint\'s models?',
      choices: [ 'Mongoose', 'Sequelize' ],
      default: self.filters.sequelizeModels ? 1 : 0,
      filter: function( val ) {
        return val.toLowerCase();
      },
      when: function() {
        return self.filters.mongoose && self.filters.sequelize;
      }
    }
  ];

  this.prompt(prompts, promptCb);
};

Generator.prototype.configuring = function config() {
  this.routeDest = path.join(this.options.endpointDirectory ||
    this.config.get('endpointDirectory') || 'server/api/', this.name);
};

Generator.prototype.writing = function createFiles() {
  this.sourceRoot(path.join(__dirname, './templates'));
  ngUtil.processDirectory(this, '.', this.routeDest);
};

Generator.prototype.end = function registerEndpoint() {
  if(this.config.get('insertRoutes')) {
    var routesFile = this.config.get('registerRoutesFile');
    var reqPath = this.relativeRequire(this.routeDest, routesFile);
    var routeConfig = {
      file: routesFile,
      needle: this.config.get('routesNeedle'),
      splicable: [
        "app.use(\'" + this.route +"\', require(\'" + reqPath + "\'));"
      ]
    };
    ngUtil.rewriteFile(routeConfig);
  }

  if (this.filters.socketio && this.config.get('insertSockets')) {
    var socketsFile = this.config.get('registerSocketsFile');
    var reqPath = this.relativeRequire(this.routeDest + '/' + this.basename +
      '.socket', socketsFile);
    var socketConfig = {
      file: socketsFile,
      needle: this.config.get('socketsNeedle'),
      splicable: [
        "require(\'" + reqPath + "\').register(socket);"
      ]
    };
    ngUtil.rewriteFile(socketConfig);
  }

  if (this.filters.sequelize && this.config.get('insertModels')) {
    var modelsFile = this.config.get('registerModelsFile');
    var reqPath = this.relativeRequire(this.routeDest + '/' + this.basename +
      '.model', modelsFile);
    var modelConfig = {
      file: modelsFile,
      needle: this.config.get('modelsNeedle'),
      splicable: [
        "db." + this.classedName + " = db.sequelize.import(\'" + reqPath +"\');"
      ]
    };
    ngUtil.rewriteFile(modelConfig);
  }
};
