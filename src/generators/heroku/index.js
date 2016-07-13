'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var chalk = require('chalk');
var path = require('path');
var s = require('underscore.string');

var Generator = module.exports = function Generator() {
  yeoman.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, './templates'));

  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = s.slugify(this.appname);
  this.filters = this.config.get('filters') || {};
};

util.inherits(Generator, yeoman.NamedBase);

Generator.prototype.askForName = function askForName() {
  var done = this.async();

  var prompts = [{
    name: 'deployedName',
    message: 'Name to deploy as (Leave blank for a random name):'
  }];

  this.prompt(prompts, function (props) {
    this.deployedName = s.slugify(props.deployedName);
    done();
  }.bind(this));
};

Generator.prototype.askForRegion = function askForRegion() {
  var done = this.async();

  var prompts = [{
    type: "list",
    name: 'region',
    message: 'On which region do you want to deploy ?',
    choices: [ "US", "EU"],
    default: 0
  }];

  this.prompt(prompts, function (props) {
    this.region = props.region.toLowerCase();
    done();
  }.bind(this));
};

Generator.prototype.checkInstallation = function checkInstallation() {
  if(this.abort) return;
  var done = this.async();

  exec('heroku --version', function (err) {
    if (err) {
      this.log.error('You don\'t have the Heroku Toolbelt installed. ' +
                     'Grab it from https://toolbelt.heroku.com/');
      this.abort = true;
    }
    done();
  }.bind(this));
};

Generator.prototype.gitInit = function gitInit() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold('\nInitializing deployment repo'));
  this.mkdir('dist');
  var child = exec('git init', { cwd: 'dist' }, function (err, stdout, stderr) {
    done();
  }.bind(this));
  child.stdout.on('data', function(data) {
    console.log(data.toString());
  });
};

Generator.prototype.herokuCreate = function herokuCreate() {
  if(this.abort) return;
  var done = this.async();
  var regionParams = (this.region !== 'us') ? ' --region ' + this.region : '';

  this.log(chalk.bold('Creating heroku app and setting node environment'));
  var child = exec('heroku apps:create ' + this.deployedName + regionParams + ' && heroku config:set NODE_ENV=production', { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.abort = true;
      this.log.error(err);
    } else {
      this.log('stdout: ' + stdout);
    }
    done();
  }.bind(this));

  child.stdout.on('data', function(data) {
    var output = data.toString();
    this.log(output);
  }.bind(this));
};

Generator.prototype.copyProcfile = function copyProcfile() {
  if(this.abort) return;
  var done = this.async();
  this.log(chalk.bold('Creating Procfile'));
  this.copy('Procfile', 'dist/Procfile');
  this.conflicter.resolve(function (err) {
    done();
  });
};

Generator.prototype.build = function build() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold('\nBuilding dist folder, please wait...'));
  var child = exec('gulp build', function (err, stdout) {
    done();
  }.bind(this));
  child.stdout.on('data', function(data) {
    this.log(data.toString());
  }.bind(this));
};

Generator.prototype.gitCommit = function gitInit() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold('Adding files for initial commit'));
  var child = exec('git add -A && git commit -m "Initial commit"', { cwd: 'dist' }, function (err, stdout, stderr) {
    if (stdout.search('nothing to commit') >= 0) {
      this.log('Re-pushing the existing "dist" build...');
    } else if (err) {
      this.log.error(err);
    } else {
      this.log(chalk.green('Done, without errors.'));
    }
    done();
  }.bind(this));

  child.stdout.on('data', function(data) {
    this.log(data.toString());
  }.bind(this));
};

Generator.prototype.gitForcePush = function gitForcePush() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold("\nUploading your initial application code.\n This may take "+chalk.cyan('several minutes')+" depending on your connection speed..."));

  var child = exec('git push -f heroku master', { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
    } else {
      var hasWarning = false;

      if(this.filters.mongoose) {
        this.log(chalk.yellow('\nBecause you\'re using mongoose, you must add mongoDB to your heroku app.\n\t' + 'from `/dist`: ' + chalk.bold('heroku addons:create mongolab') + '\n'));
        hasWarning = true;
      }

      if(this.filters.facebookAuth) {
        this.log(chalk.yellow('You will need to set environment variables for facebook auth. From `/dist`:\n\t' +
        chalk.bold('heroku config:set FACEBOOK_ID=appId\n\t') +
        chalk.bold('heroku config:set FACEBOOK_SECRET=secret\n')));
        hasWarning = true;
      }
      if(this.filters.googleAuth) {
        this.log(chalk.yellow('You will need to set environment variables for google auth. From `/dist`:\n\t' +
        chalk.bold('heroku config:set GOOGLE_ID=appId\n\t') +
        chalk.bold('heroku config:set GOOGLE_SECRET=secret\n')));
        hasWarning = true;
      }
      if(this.filters.twitterAuth) {
        this.log(chalk.yellow('You will need to set environment variables for twitter auth. From `/dist`:\n\t' +
        chalk.bold('heroku config:set TWITTER_ID=appId\n\t') +
        chalk.bold('heroku config:set TWITTER_SECRET=secret\n')));
        hasWarning = true;
      }

      this.log(chalk.green('\nYour app should now be live. To view it run\n\t' + chalk.bold('cd dist && heroku open')));
      if(hasWarning) {
        this.log(chalk.green('\nYou may need to address the issues mentioned above and restart the server for the app to work correctly.'));
      }

      this.log(chalk.yellow(
        'After app modification run\n\t' +
        chalk.bold('gulp build') +
        '\nThen deploy with\n\t' +
        chalk.bold('gulp buildcontrol:heroku')
      ));
    }
    done();
  }.bind(this));

  child.stdout.on('data', function(data) {
    this.log(data.toString());
  }.bind(this));
};
