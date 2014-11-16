'use strict';
var yeoman = require('yeoman-generator');

var Generator = yeoman.generators.Base.extend({
  compose: function() {
    this.composeWith('ng-component:controller', {arguments: this.arguments}, { local: require.resolve('generator-ng-component/controller') });
  }
});

module.exports = Generator;