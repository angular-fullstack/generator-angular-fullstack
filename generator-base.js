'use strict';

import util from 'util';
import path from 'path';
import * as genUtils from './util';

export function genBase(self) {
  self = self || this;

  try {
    self.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    self.appname = self.name || path.basename(process.cwd());
  }
  self.appname = self._.camelize(self._.slugify(self._.humanize(self.appname)));
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
}

export function genNamedBase(self) {
  self = self || this;

  // extend genBase
  genBase(self);

  var name = self.name.replace(/\//g, '-');

  self.cameledName = self._.camelize(name);
  self.classedName = self._.classify(name);

  self.basename = path.basename(self.name);
  self.dirname = (self.name.indexOf('/') >= 0) ? path.dirname(self.name) : self.name;
}
