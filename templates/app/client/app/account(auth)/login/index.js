'use strict';
import LoginController from './login.controller';

export default angular.module('<%= scriptAppName %>.login', [])
  .controller('LoginController', LoginController)
  .name;
