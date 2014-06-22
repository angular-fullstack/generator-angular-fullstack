'use strict';
var yeoman = require('yeoman-generator');

var Generator = yeoman.generators.Base.extend({
  compose: function() {
    this.composeWith('ng-component:decorator', {arguments: this.arguments});
  }
});

module.exports = Generator;