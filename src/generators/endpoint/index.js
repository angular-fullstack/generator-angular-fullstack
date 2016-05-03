'use strict';

import path from 'path';
import {Base} from 'yeoman-generator';
import {genNamedBase} from '../generator-base';

export class Generator extends Base {

  constructor(...args) {
    super(...args);

    this.argument('name', { type: String, required: true });

    this.option('route', {
      desc: 'URL for the endpoint',
      type: String
    });

    this.option('models', {
      desc: 'Specify which model(s) to use',
      type: String
    });

    this.option('endpointDirectory', {
      desc: 'Parent directory for endpoints',
      type: String
    });
  }

  initializing() {
    // init shared generator properies and methods
    genNamedBase(this);
  }

  prompting() {
    var promptCb = (props) => {
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
    };

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

    var prompts = [{
      name: 'route',
      message: 'What will the url of your endpoint be?',
      default: base + name
    }, {
      type: 'list',
      name: 'models',
      message: 'What would you like to use for the endpoint\'s models?',
      choices: [ 'Mongoose', 'Sequelize' ],
      default: this.filters.sequelizeModels ? 1 : 0,
      filter: (val) => val.toLowerCase(),
      when: () => this.filters.mongoose && this.filters.sequelize
    }];

    return this.prompt(prompts).then(promptCb);
  }

  configuring() {
    this.routeDest = path.join(this.options.endpointDirectory ||
      this.config.get('endpointDirectory') || 'server/api/', this.name);
  }

  writing() {
    this.sourceRoot(path.join(__dirname, '../../templates/endpoint'));
    this.processDirectory('.', this.routeDest);
  }

  end() {
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
      this.rewriteFile(routeConfig);
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
      this.rewriteFile(socketConfig);
    }

    if (this.filters.sequelize && this.config.get('insertModels')) {
      var modelsFile = this.config.get('registerModelsFile');
      var reqPath = this.relativeRequire(this.routeDest + '/' + this.basename + '.model', modelsFile);
      var modelConfig = {
        file: modelsFile,
        needle: this.config.get('modelsNeedle'),
        splicable: [
          "db." + this.classedName + " = db.sequelize.import(\'" + reqPath +"\');"
        ]
      };
      this.rewriteFile(modelConfig);
    }
  }
}

module.exports = Generator;
