'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var chalk = require('chalk');
var path = require('path');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates/deploy'));

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
    message: 'Name to deploy as:',
    default: this.appname
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
  exec('git init"', { cwd: 'dist' }, function (err, stdout, stderr) {
    this.log(stdout);
    done();
  }.bind(this));
};

Generator.prototype.herokuCreate = function herokuCreate() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold('Creating heroku app and setting node environment'));
  exec('heroku apps:create ' + this.deployedName + ' && heroku config:set NODE_ENV=production', { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
      this.abort = true;
    } else {
      this.log('stdout: ' + stdout);
    }
    done();
  }.bind(this));
};

Generator.prototype.copyProcfile = function copyProcfile() {
  if(this.abort) return;
  this.log(chalk.bold('Creating Procfile'));
  this.template('heroku/Procfile', 'dist/Procfile');
};

Generator.prototype.gruntBuild = function gruntBuild() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold('\nBuilding dist folder, please wait...'));
  exec('grunt build', function (err, stdout) {
    this.log('stdout: ' + stdout);
    if (err) {
      this.log.error(err);
    }
    done();
  }.bind(this));
};

Generator.prototype.gitCommit = function gitInit() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold('Adding files for initial commit'));
  exec('git add -A && git commit -m "Initial commit"', { cwd: 'dist' }, function (err, stdout, stderr) {
    if (stdout.search('nothing to commit') >= 0) {
      this.log('Re-pushing the existing "dist" build...');
    } else if (err) {
      this.log.error(err);
    } else {
      this.log(chalk.green('Done, without errors.'));
    }
    done();
  }.bind(this));
};

Generator.prototype.gitForcePush = function gitForcePush() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold("\nUploading your initial application code.\n This may take "+chalk.cyan('several minutes')+" depending on your connection speed..."));

  exec('git push -f heroku master', { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
    } else {
      this.log(chalk.green('\nYou\'re all set! Your app should now be live. To view it run\n\t' + chalk.bold('cd dist && heroku open')));
      this.log(chalk.cyan('If you\'re using mongoDB, be sure to add a database to your heroku app.\n\t' + chalk.bold('heroku addons:add mongohq') + '\n\n'));
      this.log(chalk.yellow('To deploy a new build\n\t' + chalk.bold('grunt build') +
                '\nThen enter the dist folder to commit these updates:\n\t' + chalk.bold('cd dist && git commit -am "describe your changes here"')));
      this.log(chalk.green('Finally, deploy your updated build to Heroku with\n\t' + chalk.bold('git push heroku master')));
    }
    done();
  }.bind(this));
};