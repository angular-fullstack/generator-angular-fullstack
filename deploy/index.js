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
  var done = this.async();
  this.rhcInstalled = false;
  this.herokuInstalled = false;
  if(this.name.toLowerCase() == "openshift" ){
    exec('rhc --version', function (err) {
      if (err) {
        this.log.error('OpenShift\'s rhc command line interface is not available. ' +
                       'You can install it via RubyGems with: gem install rhc');
      } else {
        this.rhcInstalled = true;
      }
      done();
    }.bind(this));
  }else if(this.name.toLowerCase() == 'heroku') {
    exec('heroku --version', function (err) {
      if (err) {
        this.log.error('You don\'t have the Heroku Toolbelt installed. ' +
                       'Grab it from https://toolbelt.heroku.com/');
      } else {
        this.herokuInstalled = true;
      }
      done();
    }.bind(this));
  }else{
    done();
  }
};

Generator.prototype.copyProcfile = function copyProcfile() {
  if(this.name.toLowerCase() != "heroku") return;
  this.template('../deploy/heroku/Procfile', 'dist/Procfile');
};

Generator.prototype.gruntBuild = function gruntBuild() {
  if(this.name.toLowerCase() != "heroku" &&
     this.name.toLowerCase() != "openshift" ) return;
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

Generator.prototype.enableOpenShiftHotDeploy = function enableOpenshiftHotDeploy() {
  if(this.name.toLowerCase() != "openshift") return;
  this.log("enabling HotDeploy for OpenShift")
  this.template('../deploy/openshift/hot_deploy', 'dist/.openshift/markers/hot_deploy');
};

Generator.prototype.gitInit = function gitInit() {
  var done = this.async();
  if(this.name.toLowerCase() == "heroku"){
    exec('git init && git add -A && git commit -m "Initial commit"', { cwd: 'dist' }, function (err) {
      if (err) {
        this.log.error(err);
      }
      done();
    }.bind(this));
  }else if(this.name.toLowerCase() == "openshift"){
    exec('git init && git add -A && git commit -m "Generating a fresh angular-fullstack application"', { cwd: 'dist' }, function (err, stdout, stderr) {
      this.log(stdout);
      if (stdout.search('nothing to commit') >= 0) {
        this.log('Re-pushing the existing "dist" build...');
      } else if (err) {
        this.log.error(err);
      }
      done();
    }.bind(this));
  }else{
    done();
  }
};

Generator.prototype.gitRemoteCheck = function gitRemoteCheck() {
  this.openshift_remote_exists = false;
  if(this.name.toLowerCase() != "openshift" || typeof this.dist_repo_url != 'undefined') return;
  var done = this.async();

  this.log("Checking for an existing git remote named 'openshift'...")
  exec('git remote -v', { cwd: 'dist' }, function (err, stdout, stderr) {
    var lines = stdout.split('\n')
    var dist_repo = ''
    this.log('stdout: ' + stdout);
    if (err) {
      this.log.error(err);
    } else {
      var repo_url_finder = /openshift[	 ]*/
      lines.forEach(function(line){
        if(line.search(repo_url_finder) == 0 && dist_repo == ''){
          var dist_repo_detailed = line.slice(line.match(repo_url_finder)[0].length)
          dist_repo = dist_repo_detailed.slice(0, dist_repo_detailed.length - 7)
      }})
      if (dist_repo != ''){ 
        console.log("Found an existing git remote for this app: "+dist_repo)
        this.dist_repo_url = dist_repo
        this.openshift_remote_exists = true;
      }
    }
    done();
  }.bind(this));
};

Generator.prototype.rhcAppShow = function rhcAppShow() {
  if(this.name.toLowerCase() != "openshift" || typeof this.dist_repo_url != 'undefined') return;
  var done = this.async();

  this.log("Checking for an existing OpenShift hosting evironment...")
  exec('rhc app show '+this.appname+' --noprompt', { cwd: 'dist' }, function (err, stdout, stderr) {
    var lines = stdout.split('\n')
    var dist_repo = ''
    if (stdout.search('Not authenticated') >= 0 || stdout.search('Invalid characters found in login') >= 0) {
      this.log.error('Error: Not authenticated. Run "rhc setup" to login to your OpenShift account and try again.');
    } else if (err) {
      this.log.error(err);
    } else {
      this.log(stdout);
      var repo_url_finder = / *Git URL: */
      lines.forEach(function(line){
        if(line.search(repo_url_finder) == 0){
          dist_repo = line.slice(line.match(repo_url_finder)[0].length)
          console.log("Found an existing git remote for this app: "+dist_repo)
      }})
      if (dist_repo != '') this.dist_repo_url = dist_repo
    }
    done();
  }.bind(this));
};

Generator.prototype.rhcAppCreate = function rhcAppCreate() {
  if(this.name.toLowerCase() != "openshift" || typeof this.dist_repo_url != 'undefined') return;
  var done = this.async();
  this.log("Creating your OpenShift hosting evironment...")
  exec('rhc app create '+this.appname+' nodejs-0.10 mongodb-2.4 -s --noprompt --no-git NODE_ENV=production', { cwd: 'dist' }, function (err, stdout, stderr) {
    var lines = stdout.split('\n')
    this.log(stdout);
    if (stdout.search('Not authenticated') >= 0 || stdout.search('Invalid characters found in login') >= 0) {
      this.log.error('Error: Not authenticated. Run "rhc setup" to login to your OpenShift account and try again.');
    } else if (err) {
      this.log.error(err);
    } else {
      var dist_repo = ''
      var repo_url_finder = / *Git remote: */
      lines.forEach(function(line){
        if(line.search(repo_url_finder) == 0){
          dist_repo = line.slice(line.match(repo_url_finder)[0].length)
      }})
      
      if (dist_repo != '') this.dist_repo_url = dist_repo
      this.log("New remote git repo at: "+this.dist_repo_url)
    }
    done();
  }.bind(this));
};

Generator.prototype.gitRemoteAdd = function gitRemoteAdd() {
  if(this.name.toLowerCase() != "openshift" || typeof this.dist_repo_url == 'undefined' || this.openshift_remote_exists) return;
  var done = this.async();
  this.log("Adding remote repo url: "+this.dist_repo_url)

  exec('git remote add openshift '+this.dist_repo_url, { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
    } else {
      this.log('stdout: ' + stdout);
      this.openshift_remote_exists = true;
    }
    done();
  }.bind(this));
};

Generator.prototype.gitForcePush = function gitForcePush() {
  if(this.name.toLowerCase() != "openshift" || !this.openshift_remote_exists ) return;
  var done = this.async();
  this.log(chalk.green("Uploading your initial application code.\n This may take "+chalk.bold('several minutes')+" depending on your connection speed..."))

  exec('git push -f openshift master', { cwd: 'dist' }, function (err, stdout, stderr) {
    if (err) {
      this.log.error(err);
    } else {
      var host_url = '';
      this.log('stdout: ' + stdout);
      var before_hostname = 'ssh://xxxxxxxxxxxxxxxxxxxxxxxx@'.length;
      var after_hostname = this.dist_repo_url.length - ( this.appname.length + 12 )
      host_url = 'http://' + this.dist_repo_url.slice(before_hostname, after_hostname)
      
      this.log(chalk.green('You\'re all set! Your app should now be live at \n\t' + chalk.bold(host_url)));
      this.log(chalk.yellow('After app modification run\n\t' + chalk.bold('grunt build') +
                '\nThen enter the dist folder to commit these updates:\n\t' + chalk.bold('cd dist && git commit -am "describe your changes here"')));
      this.log(chalk.green('Finally, deploy your updated build to OpenShift with\n\t' + chalk.bold('git push openshift master')));
      this.openshift_host_url = host_url;
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
