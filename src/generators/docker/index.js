'use strict';
import {exec} from 'child_process';
import chalk from 'chalk';
import path from 'path';
import {Base} from 'yeoman-generator';
import Promise from 'bluebird';

class Generator extends Base {
  constructor(...args) {
    super(...args);

    this.sourceRoot(path.join(__dirname, '../../templates/docker'));
  }

  initializing() {
    return genBase(this);
  }

  copyDockerfile() {
    var done = this.async();
    this.log(chalk.bold('Creating Dockerfile'));
    this.fs.copyTpl(this.templatePath('_Dockerfile'), 'dist/Dockerfile', this);
    this.conflicter.resolve(err => {
      done(err);
    });
  }

  gruntBuild() {
    this.log(chalk.bold('\nBuilding dist folder, please wait...'));

    return new Promise((resolve, reject) => {
      var child = exec('grunt build', (err, stdout) => {
        if(err) return reject(err);

        resolve();
      });

      child.stdout.on('data', data => {
        this.log(data.toString());
      });
    });
  }
}
