'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var util = require('util');
var ngUtil = require('../util');
var ScriptBase = require('../script-base.js');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  this.option('endpointDirectory', {
    desc: 'Parent directory for enpoints',
    type: String
  });
};

util.inherits(Generator, ScriptBase);

Generator.prototype.prompting = function askFor() {
  var done = this.async();
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
      filter: function( val ) {
        return val.toLowerCase();
      },
      when: function() {
        return self.filters.mongoose && self.filters.sequelize;
      }
    }
  ];

  this.prompt(prompts, function (props) {
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
  }.bind(this));
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
    var routeConfig = {
      file: this.config.get('registerRoutesFile'),
      needle: this.config.get('routesNeedle'),
      splicable: [
        "app.use(\'" + this.route +"\', require(\'./api/" + this.name + "\'));"
      ]
    };
    ngUtil.rewriteFile(routeConfig);
  }

  if (this.filters.socketio) {
    if(this.config.get('insertSockets')) {
      var socketConfig = {
        file: this.config.get('registerSocketsFile'),
        needle: this.config.get('socketsNeedle'),
        splicable: [
          "require(\'../api/" + this.name + '/' + this.name + ".socket\').register(socket);"
        ]
      };
      ngUtil.rewriteFile(socketConfig);
    }
  }

  if (this.filters.sequelize) {
    if (this.config.get('insertModels')) {
      var modelConfig = {
        file: this.config.get('registerModelsFile'),
        needle: this.config.get('modelsNeedle'),
        splicable: [
          "db." + this.classedName + " = db.sequelize.import(path.join(\n" +
          "  config.root,\n" +
          "  'server',\n" +
          "  'api',\n" +
          "  '" + this.name + "',\n" +
          "  '" + this.name + ".model'\n" +
          "));"
        ]
      };
      ngUtil.rewriteFile(modelConfig);
    }
  }
};
