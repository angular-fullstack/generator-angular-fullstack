'use strict';
import {UtilService} from './util.service';

export default angular.module('<%= scriptAppName %>.util', [])
  .factory('Util', UtilService)
  .name;
