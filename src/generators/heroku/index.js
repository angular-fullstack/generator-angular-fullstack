'use strict';
import util from 'util';
import yeoman from 'yeoman-generator';
import {Base} from 'yeoman-generator';
import {exec} from 'child_process';
import chalk from 'chalk';
import path from 'path';
import s from 'underscore.string';
import {genNamedBase} from '../generator-base';

export default class Generator extends Base {
  constructor(...args) {
    super(...args);

    this.sourceRoot(path.join(__dirname, '../../templates/heroku'));
  }

  initializing() {
    return genNamedBase(this);
  }

  askForName() {
    var done = this.async();

    var prompts = [{
      name: 'deployedName',
      message: 'Name to deploy as (Leave blank for a random name):'
    }];

    return this.prompt(prompts).then(props => {
      this.deployedName = s.slugify(props.deployedName);
    });
  }

  askForRegion() {
    var done = this.async();

    var prompts = [{
      type: 'list',
      name: 'region',
      message: 'On which region do you want to deploy ?',
      choices: ['US', 'EU'],
      default: 0
    }];

    return this.prompt(prompts).then(props => {
      this.region = props.region.toLowerCase();
    });
  }

  checkInstallation() {
    if(this.abort) return;
    var done = this.async();

    exec('heroku --version', err => {
      if(err) {
        this.log.error('You don\'t have the Heroku Toolbelt installed. Grab it from https://toolbelt.heroku.com/');
        this.abort = true;
      }
      done();
    });
  }

  gitInit() {
    if(this.abort) return;
    var done = this.async();

    this.log(chalk.bold('\nInitializing deployment repo'));
    this.mkdir('dist');
    var child = exec('git init', { cwd: 'dist' }, (err, stdout, stderr) => {
      done();
    });

    child.stdout.on('data', data => {
      this.log(data.toString());
    });
  }

  herokuCreate() {
    if(this.abort) return;
    var done = this.async();
    var regionParams = (this.region !== 'us') ? ' --region ' + this.region : '';

    this.log(chalk.bold('Creating heroku app and setting node environment'));
    var child = exec(`heroku apps:create ${this.deployedName + regionParams} && heroku config:set NODE_ENV=production`, { cwd: 'dist' }, (err, stdout, stderr) => {
      if(err) {
        this.abort = true;
        this.log.error(err);
      } else {
        this.log('stdout: ' + stdout);
      }
      done();
    });

    child.stdout.on('data', data => {
      this.log(data.toString());
    });
  }

  copyProcfile() {
    if(this.abort) return;
    var done = this.async();
    this.log(chalk.bold('Creating Procfile'));
    this.copy('Procfile', 'dist/Procfile');
    this.conflicter.resolve(err => {
      done();
    });
  }

  build() {
    if(this.abort) return;
    var done = this.async();

    this.log(chalk.bold('\nBuilding dist folder, please wait...'));

    var child = exec('gulp build', (err, stdout) => {
      done();
    });

    child.stdout.on('data', data => {
      this.log(data.toString());
    });
  }

  gitInit() {
    if(this.abort) return;
    var done = this.async();

    this.log(chalk.bold('Adding files for initial commit'));
    var child = exec('git add -A && git commit -m "Initial commit"', { cwd: 'dist' }, function (err, stdout, stderr) {
      if(stdout.search('nothing to commit') >= 0) {
        this.log('Re-pushing the existing "dist" build...');
      } else if(err) {
        this.log.error(err);
      } else {
        this.log(chalk.green('Done, without errors.'));
      }
      done();
    }.bind(this));

    child.stdout.on('data', data => {
      this.log(data.toString());
    });
  }

  gitForcePush() {
    if(this.abort) return;
    var done = this.async();

    this.log(chalk.bold("\nUploading your initial application code.\n This may take "+chalk.cyan('several minutes')+" depending on your connection speed..."));

    var child = exec('git push -f heroku master', { cwd: 'dist' }, (err, stdout, stderr) => {
      if(err) {
        this.log.error(err);
      } else {
        var hasWarning = false;

        if(this.filters.mongoose) {
          this.log(chalk.yellow(`
Because you're using mongoose, you must add mongoDB to your heroku app.
\tfrom \`/dist\`: ${chalk.bold('heroku addons:create mongolab')}
`));
          hasWarning = true;
        }

        let oauthMessage = strategy => chalk.yellow(`
You will need to set environment variables for ${strategy} auth. From \`/dist\`:
\t${chalk.bold(`heroku config:set ${strategy.toUpperCase()}_ID=appId`)}
\t${chalk.bold(`heroku config:set ${strategy.toUpperCase()}_SECRET=secret`)}
`);
        if(this.filters.facebookAuth) {
          this.log(oauthMessage('facebook'));
          hasWarning = true;
        }
        if(this.filters.googleAuth) {
          this.log(oauthMessage('google'));
          hasWarning = true;
        }
        if(this.filters.twitterAuth) {
          this.log(oauthMessage('twitter'));
          hasWarning = true;
        }

        this.log(chalk.green(`
Your app should now be live. To view it run
\t${chalk.bold('cd dist && heroku open')}`));

        if(hasWarning) {
          this.log(chalk.green('\nYou may need to address the issues mentioned above and restart the server for the app to work correctly.'));
        }

        this.log(chalk.yellow(`
After app modification run
\t${chalk.bold('gulp build')}
Then deploy with
\t${chalk.bold('gulp buildcontrol:heroku')}`));
      }
      done();
    });

    child.stdout.on('data', data => {
      this.log(data.toString());
    });
  }
}
