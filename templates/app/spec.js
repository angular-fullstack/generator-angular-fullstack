'use strict';
/*eslint-env node*/
var testsContext;

require('babel-polyfill');
require('angular');
require('angular-mocks');
<%_ if(filters.uirouter) { _%>
require('./client/components/ui-router/ui-router.mock');<% } %>
<%_ if(filters.socketio) { _%>
require('./client/components/socket/socket.mock');<% } %>

testsContext = require.context('./client', true, /\.spec\.js$/);
// var keys = testsContext.keys();
// console.log(keys);
// console.log(keys[0]);
// testsContext(keys[0]);
// console.log(keys[1]);
// testsContext(keys[1]);
// console.log(keys[2]);
// testsContext(keys[2]);
testsContext.keys().forEach(testsContext);
