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
  this.appname = this._.slugify(this.appname).split('-').join('');
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
    this.deployedName = this._.slugify(props.deployedName).split('-').join('');
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

  this.log(chalk.bold("Checking for an existing git remote named '"+this.deployedName+"'..."));
  exec('git remote -v', { cwd: 'dist' }, function (err, stdout, stderr) {
    var lines = stdout.split('\n');
    var dist_repo = '';
    this.log('stdout: ' + stdout);
    if (err && stderr.search('DL is deprecated') === -1) {
      this.log.error(err);
    } else {
      var repo_url_finder = new RegExp(this.deployedName+"[  ]*");
      lines.forEach(function(line) {
        if(line.search(repo_url_finder) === 0 && dist_repo === '') {
          var dist_repo_detailed = line.slice(line.match(repo_url_finder)[0].length);
          dist_repo = dist_repo_detailed.slice(0, dist_repo_detailed.length - 7);
      }});
      if (dist_repo !== ''){
        console.log("Found an existing git remote for this app: "+dist_repo);
        this.dist_repo_url = dist_repo;
        this.openshift_remote_exists = true;
      }
    }
    done();
  }.bind(this));
};

Generator.prototype.rhcAppShow = function rhcAppShow() {
  if(this.abort || typeof this.dist_repo_url !== 'undefined') return;
  var done = this.async();

  this.log(chalk.bold("Checking for an existing OpenShift hosting environment..."));
  exec('rhc app show '+this.deployedName+' --noprompt', { cwd: 'dist' }, function (err, stdout, stderr) {
    var lines = stdout.split('\n');
    var dist_repo = '';
    if (stdout.search('Not authenticated') >= 0 || stdout.search('Invalid characters found in login') >= 0) {
      this.log.error('Error: Not authenticated. Run "rhc setup" to login to your OpenShift account and try again.');
      this.abort = true;
    } else if (err && stderr.search('DL is deprecated') === -1) {
      this.log.error(err);
    } else {
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

  this.log(chalk.bold("Creating your OpenShift hosting environment, this may take a couple minutes..."));
  exec('rhc app create '+this.deployedName+' nodejs-0.10 mongodb-2.4 -s --noprompt --no-git NODE_ENV=production', { cwd: 'dist' }, function (err, stdout, stderr) {
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
};

Generator.prototype.gitRemoteAdd = function gitRemoteAdd() {
  if(this.abort || typeof this.dist_repo_url === 'undefined' || this.openshift_remote_exists) return;
  var done = this.async();
  this.log(chalk.bold("Adding remote repo url: "+this.dist_repo_url));

  exec('git remote add '+this.deployedName+' '+this.dist_repo_url, { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
    } else {
      this.openshift_remote_exists = true;
    }
    done();
  }.bind(this));
};

Generator.prototype.enableOpenShiftHotDeploy = function enableOpenshiftHotDeploy() {
  if(this.abort || !this.openshift_remote_exists ) return;
  this.log(chalk.bold("enabling HotDeploy for OpenShift"));
  this.template('openshift/hot_deploy', 'dist/.openshift/markers/hot_deploy');
};

Generator.prototype.gruntBuild = function gruntBuild() {
  if(this.abort || !this.openshift_remote_exists ) return;
  var done = this.async();

  this.log(chalk.bold('Building dist folder, please wait...'));
  exec('grunt build', function (err, stdout) {
    this.log('stdout: ' + stdout);
    if (err) {
      this.log.error(err);
    }
    done();
  }.bind(this));
};

Generator.prototype.gitCommit = function gitInit() {
  if(this.abort || !this.openshift_remote_exists ) return;
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
  if(this.abort || !this.openshift_remote_exists ) return;
  var done = this.async();
  this.log(chalk.bold("\nUploading your initial application code.\n This may take "+chalk.cyan('several minutes')+" depending on your connection speed..."));

  exec('git push -f '+this.deployedName+' master', { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
    } else {
      var host_url = '';
      this.log('stdout: ' + stdout);
      var before_hostname = 'ssh://xxxxxxxxxxxxxxxxxxxxxxxx@'.length;
      var after_hostname = this.dist_repo_url.length - ( this.deployedName.length + 12 );
      host_url = 'http://' + this.dist_repo_url.slice(before_hostname, after_hostname);

      this.log(chalk.green('\nYou\'re all set! Your app should now be live at \n\t' + chalk.bold(host_url)));
      this.log(chalk.yellow('After app modification run\n\t' + chalk.bold('grunt build') +
                '\nThen enter the dist folder to commit these updates:\n\t' + chalk.bold('cd dist && git commit -am "describe your changes here"')));
      this.log(chalk.green('Finally, deploy your updated build to OpenShift with\n\t' + chalk.bold('git push '+this.deployedName+' master')));
      this.openshift_host_url = host_url;
    }
    done();
  }.bind(this));
};
