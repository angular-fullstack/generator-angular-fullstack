'use strict';
var yeoman = require('yeoman-generator');

var Generator = yeoman.Base.extend({
  compose: function() {
    this.composeWith('ng-component:directive', {arguments: this.arguments}, { local: require.resolve('generator-ng-component/directive') });
  }
});

module.exports = Generator;
