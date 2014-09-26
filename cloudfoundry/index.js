'use strict';
var util = require('util');
var genUtils = require('../util.js');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var chalk = require('chalk');
var path = require('path');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, './templates'));

  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this.appname);
  this.filters = this.config.get('filters') || {};
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askForRoute = function askForRoute() {
  var done = this.async();

  var prompts = [
    {
      name: 'routeName',
      message: 'Name of route to deploy (Leave blank for a random route name):'
    }
  ];

  this.prompt(prompts, function (props) {
    this.routeName = this._.slugify(props.routeName);
    done();
  }.bind(this));
};

Generator.prototype.checkInstallation = function checkInstallation() {
  if (this.abort) return;
  var done = this.async();

  exec('cf --version', function (err) {
    if (err) {
      this.log.error('You don\'t have the Cloud Foundry CLI installed. ' +
          'Grab it from https://github.com/cloudfoundry/cli');
      this.abort = true;
    }
    done();
  }.bind(this));
};

Generator.prototype.askForApiEndpoint = function askForApiEndpoint() {
  if (this.abort) return;
  var done = this.async();

  var prompts = [
    {
      name: 'apiEndpoint',
      default: 'api.run.pivotal.io',
      message: 'What api endpoint will you be using for Cloud Foundry?:'
    }
  ];

  this.prompt(prompts, function (props) {
    this.apiEndpoint = props.apiEndpoint;
    done();
  }.bind(this));
};

Generator.prototype.cfInit = function cfInit() {
  if (this.abort) return;
  var done = this.async();

  this.log(chalk.bold('Setting Cloud Foundry api endpoint'));
  this.mkdir('dist');
  var child = exec('cf api ' + this.apiEndpoint, { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.abort = true;
      this.log.error(err);
    } else {
      if (stdout.indexOf('Not logged in.') !== -1) {
        this.log.error('You don\'t appear to be logged.  Please login and try again.');
        this.abort = true;
      } else {
        this.log('stdout: ' + stdout);
      }

    }
    done();
  }.bind(this));

  child.stdout.on('data', function (data) {
    this.log(this._.trim(data.toString(), "\n\r"));
  }.bind(this));
}

Generator.prototype.copyProcfile = function copyProcfile() {
  if (this.abort) return;
  var done = this.async();
  this.log(chalk.bold('Creating Procfile and manifest.yml'));
  genUtils.processDirectory(this, '.', './dist');
  this.conflicter.resolve(function (err) {
    done();
  });
};

Generator.prototype.gruntBuild = function gruntBuild() {
  if (this.abort) return;
  var done = this.async();

  this.log(chalk.bold('\nBuilding dist folder, please wait...'));
  var child = exec('grunt build', function (err, stdout) {
    done();
  }.bind(this));
  child.stdout.on('data', function (data) {
    this.log(data.toString());
  }.bind(this));
};

Generator.prototype.cfPush = function cfPush() {
  if (this.abort) return;
  var done = this.async();

  this.log(chalk.bold("\nUploading your initial application code.\n This may take " + chalk.cyan('several minutes') + " depending on your connection speed..."));

  var randomRoute = this.routeName === '' ? '--random-route' : '';
  var child = exec(['cf push', this.appname, randomRoute].join(' '), { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
    } else {
      var hasWarning = false;

      if (this.filters.mongoose) {
        this.log(chalk.yellow('\nBecause you\'re using mongoose, you must add mongoDB to your cloud foundry app.\n\t' + 'from `/dist`: ' + chalk.bold('cf create-service mongolab sandbox my-mongo') + '\n'));
        hasWarning = true;
      }

      if (this.filters.facebookAuth) {
        this.log(chalk.yellow('You will need to set environment variables for facebook auth. From `/dist`:\n\t' +
            chalk.bold('cf set-env ' + this.appName + ' FACEBOOK_ID appId\n\t') +
            chalk.bold('cf set-env ' + this.appName + ' FACEBOOK_SECRET secret\n')));
        hasWarning = true;
      }
      if (this.filters.googleAuth) {
        this.log(chalk.yellow('You will need to set environment variables for google auth. From `/dist`:\n\t' +
            chalk.bold('cf set-env ' + this.appName + ' GOOGLE_ID appId\n\t') +
            chalk.bold('cf set-env ' + this.appName + ' GOOGLE_SECRET secret\n')));
        hasWarning = true;
      }
      if (this.filters.twitterAuth) {
        this.log(chalk.yellow('You will need to set environment variables for twitter auth. From `/dist`:\n\t' +
            chalk.bold('cf set-env ' + this.appName + ' TWITTER_ID appId\n\t') +
            chalk.bold('cf set-env ' + this.appName + ' TWITTER_SECRET secret\n')));
        hasWarning = true;
      }

      this.log(chalk.green('\nYour app should now be live.'));
      if (hasWarning) {
        this.log(chalk.green('\nYou may need to address the issues mentioned above and restart the server for the app to work correctly.'));
      }
      /*
       todo: build grunt plugin grunt-cf-deploy and add to this generator
       this.log(chalk.yellow('After app modification run\n\t' + chalk.bold('grunt build') +
       '\nThen deploy with\n\t' + chalk.bold('grunt cfDeploy')));
       */
    }
    done();
  }.bind(this));
  child.stdout.on('data', function (data) {
    this.log(this._.trim(data.toString(), "\n\r"));
  }.bind(this));
};
