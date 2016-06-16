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

testsContext = require.context('./client', true, /\.spec\.<%= scriptExt %>$/);
testsContext.keys().forEach(testsContext);
