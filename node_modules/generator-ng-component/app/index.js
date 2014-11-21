'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var NgComponentGenerator = yeoman.generators.Base.extend({

  info: function () {
    if (!this.options['skip-message']) {
      console.log(chalk.magenta('You\'re using the fantastic NgComponent generator.\n'));
      console.log(chalk.magenta('Initializing yo-rc.json configuration.\n'));
    }
  },

  saveConfig: function () {
    this.config.defaults({
      'routeDirectory': this.options.routeDirectory || 'app/components/',
      'directiveDirectory': this.options.directiveDirectory || 'app/components/',
      'filterDirectory': this.options.filterDirectory || 'app/components/',
      'serviceDirectory': this.options.serviceDirectory || 'app/components/',
      'basePath': this.options.basePath || 'app',
      'moduleName': this.options.moduleName || '',
      'filters': this.options.filters || ['uirouter'],
      'extensions': this.options.extensions || ['js', 'html', 'scss'],
      'directiveSimpleTemplates': this.options.directiveSimple || '',
      'directiveComplexTemplates': this.options.directiveComplex || '',
      'filterTemplates': this.options.filter || '',
      'serviceTemplates': this.options.service || '',
      'factoryTemplates': this.options.factory || '',
      'controllerTemplates': this.options.controller || '',
      'decoratorTemplates': this.options.decorator || '',
      'providerTemplates': this.options.provider || '',
      'routeTemplates': this.options.route || ''
    });
  }
});

module.exports = NgComponentGenerator;