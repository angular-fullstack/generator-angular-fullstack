'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');

global.expect = chai.expect;
global.assert = chai.assert;
global.sinon = sinon;

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
