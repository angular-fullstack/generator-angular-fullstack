'use strict';
/*eslint-env node*/
import 'babel-polyfill';

import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
<%_ if (filters.jasmine) { -%>
import 'zone.js/dist/jasmine-patch';
<%_ } -%>
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';

var testsContext = require.context('./client', true, /\.(spec|test)\.<%= scriptExt %>$/);
// testsContext.keys().forEach(testsContext);
// testsContext('./app/main/main.component.spec.<%= scriptExt %>');
testsContext('./components/util.spec.<%= scriptExt %>');
<%_ if(filters.oauth) { -%>
testsContext('./components/oauth-buttons/oauth-buttons.component.spec.<%= scriptExt %>');
<%_ } -%>

import { TestBed, getTestBed } from '@angular/core/testing';
import browser from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());

<%_ if (filters.mocha) { -%>
var hook = new Mocha.Hook('Modified Angular beforeEach Hook', function() {
  getTestBed().resetTestingModule();
});

hook.ctx = mocha.suite.ctx;
hook.parent = mocha.suite;
mocha.suite._beforeEach = [hook];
<%_ } -%>
