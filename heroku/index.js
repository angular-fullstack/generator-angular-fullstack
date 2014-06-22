'use strict';
var util = require('util');
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
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.askForName = function askForName() {
  var done = this.async();

  var prompts = [{
    name: 'deployedName',
    message: 'Name to deploy as (Leave blank for a random name):'
  }];

  this.prompt(prompts, function (props) {
    this.deployedName = this._.slugify(props.deployedName);
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

  this.log(chalk.bold('Creating heroku app and setting node environment'));
  var child = exec('heroku apps:create ' + this.deployedName + ' && heroku config:set NODE_ENV=production', { cwd: 'dist' }, function (err, stdout, stderr) {
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
  child.stdin.write('\n\n');
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

Generator.prototype.gruntBuild = function gruntBuild() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold('\nBuilding dist folder, please wait...'));
  var child = exec('grunt build', function (err, stdout) {
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
      this.log(chalk.green('\nYou\'re all set! Your app should now be live. To view it run\n\t' + chalk.bold('cd dist && heroku open')));
      this.log(chalk.cyan('If you\'re using mongoDB, be sure to add a database to your heroku app.\n\t' + chalk.bold('heroku addons:add mongohq') + '\n\n'));
      this.log(chalk.yellow('To deploy a new build\n\t' + chalk.bold('grunt build') +
                '\nThen enter the dist folder to commit these updates:\n\t' + chalk.bold('cd dist && git commit -am "describe your changes here"')));
      this.log(chalk.green('Finally, deploy your updated build to Heroku with\n\t' + chalk.bold('git push -f heroku master')));
    }
    done();
  }.bind(this));

  child.stdout.on('data', function(data) {
    this.log(data.toString());
  }.bind(this));
};