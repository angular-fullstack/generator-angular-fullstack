'use strict';
var yeoman = require('yeoman-generator');

var Generator = yeoman.generators.Base.extend({
  compose: function() {
    this.composeWith('ng-component:factory', {arguments: this.arguments}, { local: require.resolve('generator-ng-component/factory') });
  }
});

module.exports = Generator;