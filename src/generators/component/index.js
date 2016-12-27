'use strict';
import YoGenerator from 'yeoman-generator';

class Generator extends YoGenerator {
  compose() { 
    this.composeWith(require.resolve('generator-ng-component/generators/component'), {}, this.arguments);
  }
}

module.exports = Generator;
