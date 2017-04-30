'use strict';

import path from 'path';
import _ from 'lodash';
import s from 'underscore.string';
import { Base as YoBase } from 'yeoman-generator';
import yoWelcome from 'yeoman-welcome';
import * as genUtils from './util';

// extend lodash with underscore.string
_.mixin(s.exports());

export class Base extends YoBase {
  constructor(...args) {
    super(...args);

    this.lodash = _;
    this.yoWelcome = yoWelcome;

    this.appname = _.camelize(_.slugify(_.humanize(this.determineAppname())));

    this.scriptAppName = this.appname + this.appSuffix();

    this.filters = this.filters || this.config.get('filters');

    // dynamic relative require path
    this.relativeRequire = genUtils.relativeRequire.bind(this);
    // process template directory
    this.processDirectory = genUtils.processDirectory.bind(this);
    // rewrite a file in place
    this.rewriteFile = genUtils.rewriteFile;
  }

  appSuffix() {
    var suffix = this.options['app-suffix'];
    return (typeof suffix === 'string') ? this.lodash.classify(suffix) : '';
  }

  determineAppname() {
    if(this.name) return this.name;
    else return super.determineAppname();
  }

  // dynamic assertion statements
  expect() {
    return this.filters.expect ? 'expect(' : '';
  }
  to() {
    return this.filters.expect ? ').to' : '.should';
  }
}

export class NamedBase extends Base {
  constructor(...args) {
    super(...args);

    this.argument('name', { type: String, required: true });

    var name = this.name.replace(/\//g, '-');

    this.cameledName = _.camelize(name);
    this.classedName = _.classify(name);

    this.basename = path.basename(this.name);
    this.dirname = this.name.includes('/')
      ? path.dirname(this.name)
      : this.name;
  }
}

export function genBase(self) {
  self = self || this;

  self.lodash = _;
  self.yoWelcome = yoWelcome;

  let baseDetermineAppname = self.determineAppname.bind(self);
  self.determineAppname = () => {
    if(self['name']) {
      return self['name'];
    } else {
      return baseDetermineAppname();
    }
  }

  self.appname = _.camelize(_.slugify(
    _.humanize(self.determineAppname())
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

  return Promise.resolve();
}

export function genNamedBase(self) {
  self = self || this;

  // extend genBase
  return genBase(self).then(() => {
    var name = self.name.replace(/\//g, '-');

    self.cameledName = _.camelize(name);
    self.classedName = _.classify(name);

    self.basename = path.basename(self.name);
    self.dirname = (self.name.indexOf('/') >= 0) ? path.dirname(self.name) : self.name;
  });
}
