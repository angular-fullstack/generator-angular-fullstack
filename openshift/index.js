'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var childProcess = require('child_process');
var chalk = require('chalk');
var path = require('path');
var s = require('underscore.string');
var exec = childProcess.exec;
var spawn = childProcess.spawn;

var Generator = module.exports = function Generator() {
  yeoman.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, './templates'));

  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = s.slugify(this.appname).split('-').join('');
  this.filters = this.config.get('filters') || {};
};

util.inherits(Generator, yeoman.NamedBase);

Generator.prototype.askForName = function askForName() {
  var done = this.async();

  var prompts = [{
    name: 'deployedName',
    message: 'Name to deploy as:',
    default: this.appname
  }];

  this.prompt(prompts, function (props) {
    this.deployedName = s.slugify(props.deployedName).split('-').join('');
    done();
  }.bind(this));
};

Generator.prototype.checkInstallation = function checkInstallation() {
  if(this.abort) return;
  var done = this.async();

  exec('rhc --version', function (err) {
    if (err) {
      this.log.error('OpenShift\'s rhc command line interface is not available. ' +
                     'You can install it via RubyGems with: gem install rhc');
      this.abort = true;
    }
    done();
  }.bind(this));
};

Generator.prototype.gitInit = function gitInit() {
  if(this.abort) return;
  var done = this.async();

  this.log(chalk.bold('Initializing deployment repo'));
  this.mkdir('dist');
  exec('git init', { cwd: 'dist' }, function (err, stdout, stderr) {
    this.log(stdout);
    done();
  }.bind(this));
};

Generator.prototype.gitRemoteCheck = function gitRemoteCheck() {
  this.openshift_remote_exists = false;
  if(this.abort || typeof this.dist_repo_url !== 'undefined') return;
  var done = this.async();

  this.log(chalk.bold("\nChecking for an existing git remote named '"+'openshift'+"'..."));
  exec('git remote -v', { cwd: 'dist' }, function (err, stdout, stderr) {
    var lines = stdout.split('\n');
    var dist_repo = '';
    if (err && stderr.search('DL is deprecated') === -1) {
      this.log.error(err);
    } else {
      var repo_url_finder = new RegExp('openshift'+"[  ]*");
      lines.forEach(function(line) {
        if(line.search(repo_url_finder) === 0 && dist_repo === '') {
          var dist_repo_detailed = line.slice(line.match(repo_url_finder)[0].length);
          dist_repo = dist_repo_detailed.slice(0, dist_repo_detailed.length - 7);
      }});
      if (dist_repo !== ''){
        console.log("Found an existing git remote for this app: "+dist_repo);
        this.dist_repo_url = dist_repo;
        this.openshift_remote_exists = true;
      } else {
        console.log('No existing remote found.');
      }
    }
    done();
  }.bind(this));
};

Generator.prototype.rhcAppShow = function rhcAppShow() {
  if(this.abort || typeof this.dist_repo_url !== 'undefined') return;
  var done = this.async();

  this.log(chalk.bold("\nChecking for an existing OpenShift hosting environment..."));
  var child = exec('rhc app show '+this.deployedName+' --noprompt', { cwd: 'dist' }, function (err, stdout, stderr) {
    var lines = stdout.split('\n');
    var dist_repo = '';
    // Unauthenticated
    if (stdout.search('Not authenticated') >= 0 || stdout.search('Invalid characters found in login') >= 0) {
      this.log.error('Error: Not authenticated. Run "rhc setup" to login to your OpenShift account and try again.');
      this.abort = true;
    }
    // No remote found
    else if (stdout.search('not found.') >= 0) {
      console.log('No existing app found.');
    }
    // Error
    else if (err && stderr.search('DL is deprecated') === -1) {
      this.log.error(err);
    }
    // Remote found
    else {
      this.log(stdout);
      var repo_url_finder = / *Git URL: */;
      lines.forEach(function(line) {
        if(line.search(repo_url_finder) === 0) {
          dist_repo = line.slice(line.match(repo_url_finder)[0].length);
          console.log("Found an existing git remote for this app: "+dist_repo);
      }});
      if (dist_repo !== '') this.dist_repo_url = dist_repo;
    }
    done();
  }.bind(this));
};

Generator.prototype.rhcAppCreate = function rhcAppCreate() {
  if(this.abort || typeof this.dist_repo_url !== 'undefined') return;
  var done = this.async();

  this.log(chalk.bold("\nCreating your OpenShift hosting environment, this may take a couple minutes..."));
  var child = exec('rhc app create '+this.deployedName+' nodejs-0.10 mongodb-2.4 -s --noprompt --no-git NODE_ENV=production', { cwd: 'dist' }, function (err, stdout, stderr) {
    var lines = stdout.split('\n');
    this.log(stdout);
    if (stdout.search('Not authenticated') >= 0 || stdout.search('Invalid characters found in login') >= 0) {
      this.log.error('Error: Not authenticated. Run "rhc setup" to login to your OpenShift account and try again.');
      this.abort = true;
    } else if (err && stderr.search('DL is deprecated') === -1) {
      this.log.error(err);
    } else {
      var dist_repo = '';
      var repo_url_finder = / *Git remote: */;
      lines.forEach(function(line) {
        if(line.search(repo_url_finder) === 0) {
          dist_repo = line.slice(line.match(repo_url_finder)[0].length);
      }});

      if (dist_repo !== '') this.dist_repo_url = dist_repo;
      if(this.dist_repo_url !== undefined) {
        this.log("New remote git repo at: "+this.dist_repo_url);
      }
    }
    done();
  }.bind(this));

  child.stdout.on('data', function(data) {
    this.log(data.toString());
  }.bind(this));
};

Generator.prototype.gitRemoteAdd = function gitRemoteAdd() {
  if(this.abort || typeof this.dist_repo_url === 'undefined' || this.openshift_remote_exists) return;
  var done = this.async();
  this.log(chalk.bold("\nAdding remote repo url: "+this.dist_repo_url));

  var child = exec('git remote add '+'openshift'+' '+this.dist_repo_url, { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
    } else {
      this.openshift_remote_exists = true;
    }
    done();
  }.bind(this));

  child.stdout.on('data', function(data) {
    this.log(data.toString());
  }.bind(this));
};

Generator.prototype.enableOpenShiftHotDeploy = function enableOpenshiftHotDeploy() {
  if(this.abort || !this.openshift_remote_exists ) return;
  var done = this.async();
  this.log(chalk.bold("\nEnabling HotDeploy for OpenShift"));
  this.copy('hot_deploy', 'dist/.openshift/markers/hot_deploy');
  this.conflicter.resolve(function (err) {
    done();
  });
};

Generator.prototype.gruntBuild = function gruntBuild() {
  if(this.abort || !this.openshift_remote_exists ) return;
  var done = this.async();

  this.log(chalk.bold('\nBuilding dist folder, please wait...'));
  var child = exec('grunt build', function (err, stdout) {
    if (err) {
      this.log.error(err);
    }
    done();
  }.bind(this));

  child.stdout.on('data', function(data) {
    this.log(data.toString());
  }.bind(this));
};

Generator.prototype.gitCommit = function gitInit() {
  if(this.abort || !this.openshift_remote_exists ) return;
  var done = this.async();

  this.log(chalk.bold('\nAdding files for initial commit'));
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
  if (this.abort || !this.openshift_remote_exists) return;
  var done = this.async();
  this.log(chalk.bold("\nUploading your initial application code.\n This may take " + chalk.cyan('several minutes') + " depending on your connection speed..."));

  var push = spawn('git', ['push', '-f', 'openshift', 'master'], {cwd: 'dist'});
  var error = null;

  push.stderr.on('data', function (data) {
    var output = data.toString();
    this.log.error(output);
  }.bind(this));

  push.stdout.on('data', function (data) {
    var output = data.toString();
    this.log.stdin(output);
  }.bind(this));

  push.on('exit', function (code) {
    if (code !== 0) {
      this.abort = true;
      return done();
    }
    done();
  }.bind(this));
};

Generator.prototype.restartApp = function restartApp() {
  if(this.abort || !this.openshift_remote_exists ) return;
  this.log(chalk.bold("\nRestarting your openshift app.\n"));

  var child = exec('rhc app restart -a ' + this.deployedName, function(err, stdout, stderr) {

    var host_url = '';
    var hasWarning = false;
    var before_hostname = this.dist_repo_url.indexOf('@') + 1;
    var after_hostname = this.dist_repo_url.length - ( 'openshift'.length + 12 );
    host_url = 'http://' + this.dist_repo_url.slice(before_hostname, after_hostname) + 'com';

    if(this.filters.facebookAuth) {
      this.log(chalk.yellow('You will need to set environment variables for facebook auth:\n\t' +
      chalk.bold('rhc set-env FACEBOOK_ID=id -a ' + this.deployedName + '\n\t') +
      chalk.bold('rhc set-env FACEBOOK_SECRET=secret -a ' + this.deployedName + '\n')));
      hasWarning = true;
    }
    if(this.filters.googleAuth) {
      this.log(chalk.yellow('You will need to set environment variables for google auth:\n\t' +
      chalk.bold('rhc set-env GOOGLE_ID=id -a ' + this.deployedName + '\n\t') +
      chalk.bold('rhc set-env GOOGLE_SECRET=secret -a ' + this.deployedName + '\n')));
      hasWarning = true;
    }
    if(this.filters.twitterAuth) {
      this.log(chalk.yellow('You will need to set environment variables for twitter auth:\n\t' +
      chalk.bold('rhc set-env TWITTER_ID=id -a ' + this.deployedName + '\n\t') +
      chalk.bold('rhc set-env TWITTER_SECRET=secret -a ' + this.deployedName + '\n')));
      hasWarning = true;
    }

    this.log(chalk.green('\nYour app should now be live at \n\t' + chalk.bold(host_url)));
    if(hasWarning) {
      this.log(chalk.green('\nYou may need to address the issues mentioned above and restart the server for the app to work correctly \n\t' +
      'rhc app-restart -a ' + this.deployedName));
    }
    this.log(chalk.yellow('After app modification run\n\t' + chalk.bold('grunt build') +
    '\nThen deploy with\n\t' + chalk.bold('grunt buildcontrol:openshift')));
  }.bind(this));
};
