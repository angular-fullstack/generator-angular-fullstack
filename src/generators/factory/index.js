'use strict';
var yeoman = require('yeoman-generator');

var Generator = yeoman.Base.extend({
  compose: function() {
    this.composeWith('ng-component:factory', {arguments: this.arguments}, { local: require.resolve('generator-ng-component/generators/factory') });
  }
});

module.exports = Generator;
