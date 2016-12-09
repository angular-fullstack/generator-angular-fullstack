/*eslint-env node*/

Error.stackTraceLimit = Infinity;

require('./client/app/polyfills');
require('babel-polyfill');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy');
require('zone.js/dist/sync-test');
<%_ if(filters.jasmine) { -%>
require('zone.js/dist/jasmine-patch');<% } %>
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

var testsContext = require.context('./client', true, /\.spec\.<%= scriptExt %>$/);
// testsContext.keys().forEach(testsContext); //TODO
testsContext('./app/main/main.component.spec.js');

var ngTest = require('@angular/core/testing');
var TestBed = ngTest.TestBed;
var getTestBed = ngTest.getTestBed;

var browser = require('@angular/platform-browser-dynamic/testing');

TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());

<%_ if(filters.mocha) { -%>
var hook = new Mocha.Hook('Modified Angular beforeEach Hook', function() {
    getTestBed().resetTestingModule();
});

hook.ctx = mocha.suite.ctx;
hook.parent = mocha.suite;
mocha.suite._beforeEach = [hook];<% } %>
