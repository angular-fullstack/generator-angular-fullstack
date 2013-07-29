'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');
var fs = require('fs');

var Generator = module.exports = function Generator(args, options) {
  ScriptBase.apply(this, arguments);
  this.fileName = this.name;
};

util.inherits(Generator, ScriptBase);

Generator.prototype.askForOverwrite = function askForOverwrite() {
  var cb = this.async();

  // TODO: Any yeoman.util function to handle this?
  var fileExists = fs.existsSync(this.env.cwd + '/app/scripts/' + buildRelativePath(this.fileName) + '.js');
  if (fileExists) {
    var prompts = [{
      type: 'confirm',
      name: 'overwriteDecorator',
      message: 'Would you like to overwrite existing decorator?',
      default: false
    }];

    this.prompt(prompts, function (props) {
      this.overwriteDecorator = props.overwriteDecorator;

      cb();
    }.bind(this));
  } else {
    cb();
  }
};

Generator.prototype.askForNewName = function askForNewName() {
  var cb = this.async();

  if (this.overwriteDecorator === undefined || this.overwriteDecorator === true) {
    cb();
    return;
  }

  var prompts = [];
  prompts.push({
    name: 'decoratorName',
    message: 'Alternative name for the decorator'
  });

  this.prompt(prompts, function (props) {
    this.fileName = props.decoratorName;

    cb();
  }.bind(this));
};

Generator.prototype.createDecoratorFiles = function createDecoratorFiles() {
  this.appTemplate('decorator', 'scripts/' + buildRelativePath(this.fileName));
  this.addScriptToIndex(buildRelativePath(this.fileName));
};

function buildRelativePath(fileName){
  return 'decorators/' + fileName + 'Decorator';
}
