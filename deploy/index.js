'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');
var exec = require('child_process').exec;
var chalk = require('chalk');

var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);
};

util.inherits(Generator, ScriptBase);

Generator.prototype.checkInstallation = function checkInstallation() {
  if(this.name.toLowerCase() != "heroku") return;
  var done = this.async();

  this.herokuInstalled = false;
  exec('heroku --version', function (err) {
    if (err) {
      this.log.error('You don\'t have the Heroku Toolbelt installed. ' +
                     'Grab it from https://toolbelt.heroku.com/');
    } else {
      this.herokuInstalled = true;
    }
    done();
  }.bind(this));
};

Generator.prototype.copyProcfile = function copyProcfile() {
  if(this.name.toLowerCase() != "heroku") return;
  this.template('../deploy/heroku/Procfile', 'dist/Procfile');
};

Generator.prototype.gruntBuild = function gruntBuild() {
  if(this.name.toLowerCase() != "heroku") return;
  var done = this.async();
 
  console.log(chalk.bold('Building dist folder, please wait...'));
  exec('grunt build', function (err, stdout) {
    console.log('stdout: ' + stdout);

    if (err) {
      this.log.error(err);
    }
    done();
  }.bind(this));
};

Generator.prototype.gitInit = function gitInit() {
  if(this.name.toLowerCase() != "heroku") return;
  var done = this.async();

  exec('git init && git add -A && git commit -m "Initial commit"', { cwd: 'dist' }, function (err) {
    if (err) {
      this.log.error(err);
    }
    done();
  }.bind(this));
};

Generator.prototype.herokuCreate = function herokuCreate() {
  if(this.name.toLowerCase() != "heroku") return;
  var done = this.async();

  exec('heroku apps:create && heroku config:set NODE_ENV=production', { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
    } else {
      console.log('stdout: ' + stdout);
      console.log(chalk.green('You\'re all set! Now push to heroku with\n\t' + chalk.bold('git push heroku master') +
                '\nfrom your new ' + chalk.bold('dist') + ' folder'));
      console.log(chalk.yellow('After app modification run\n\t' + chalk.bold('grunt build') +
                '\nthen commit and push the dist folder'));
    }
    done();
  }.bind(this));
};
