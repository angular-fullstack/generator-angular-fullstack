'use strict';
var yeoman = require('yeoman-generator');

var Generator = yeoman.Base.extend({
  compose: function() {
    this.composeWith('ng-component:route', {arguments: this.arguments}, { local: require.resolve('generator-ng-component/generators/route') });
  }
});

module.exports = Generator;
