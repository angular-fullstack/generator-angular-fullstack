'use strict';
import {Base} from 'yeoman-generator';

class Generator extends Base {
  compose() {
    this.composeWith('ng-component:component', {
      arguments: this.arguments
    }, {
      local: require.resolve('generator-ng-component/component')
    });
  }
}

module.exports = Generator;
