'use strict';

import util from 'util';
import path from 'path';
import lodash from 'lodash';
import s from 'underscore.string';
import semver from 'semver';
import yoWelcome from 'yeoman-welcome';
import * as genUtils from './util';

// extend lodash with underscore.string
lodash.mixin(s.exports());

export function genBase(self) {
  self = self || this;

  let yoCheckPromise = genUtils.runCmd('yo --version').then(stdout => {
    if(!semver.satisfies(semver.clean(stdout), '>= 1.7.1')) {
      throw new Error('ERROR: You need to update yo to at least 1.7.1 (npm i -g yo)');
    }
  });

  self.lodash = lodash;
  self.yoWelcome = yoWelcome;

  let baseDetermineAppname = self.determineAppname.bind(self);
  self.determineAppname = () => {
    if(self['name']) {
      return self['name'];
    } else {
      return baseDetermineAppname();
    }
  }

  self.appname = lodash.camelize(lodash.slugify(
    lodash.humanize(self.determineAppname())
  ));
  self.scriptAppName = self.appname + genUtils.appSuffix(self);

  self.filters = self.filters || self.config.get('filters');

  // dynamic assertion statements
  self.expect = function() {
    return self.filters.expect ? 'expect(' : '';
  };
  self.to = function() {
    return self.filters.expect ? ').to' : '.should';
  };

  // dynamic relative require path
  self.relativeRequire = genUtils.relativeRequire.bind(self);
  // process template directory
  self.processDirectory = genUtils.processDirectory.bind(self);
  // rewrite a file in place
  self.rewriteFile = genUtils.rewriteFile;

  return yoCheckPromise;
}

export function genNamedBase(self) {
  self = self || this;

  // extend genBase
  return genBase(self).then(() => {
    var name = self.name.replace(/\//g, '-');

    self.cameledName = lodash.camelize(name);
    self.classedName = lodash.classify(name);

    self.basename = path.basename(self.name);
    self.dirname = (self.name.indexOf('/') >= 0) ? path.dirname(self.name) : self.name;
  });
}
