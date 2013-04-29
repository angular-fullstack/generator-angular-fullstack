'use strict';
var path = require('path');
var util = require('util');
var ScriptBase = require('../script-base.js');
var angularUtils = require('../util.js');


module.exports = Generator;

function Generator() {
    ScriptBase.apply(this, arguments);
    var postFix = "Decorator";

    //TODO: Any better way in yeoman to get this value?
    var fileName = arguments[0][1];
    if(fileName === undefined){
        fileName = this.name+postFix;
    }
    else{
        fileName += postFix;
    }
    this.fileName = fileName;
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createDecoratorFiles = function createDecoratorFiles() {
    this.appTemplate('decorator', 'scripts/decorators/' + this.fileName);
    this.addScriptToIndex('decorators/' + this.fileName);
};
