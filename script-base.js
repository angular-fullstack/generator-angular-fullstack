'use strict';

import util from 'util';
import path from 'path';
import {NamedBase} from 'yeoman-generator';
import * as genUtils from './util';

export default class ScriptBase extends NamedBase {
  constructor(...args) {
    super(...args);

    try {
      this.appname = require(path.join(process.cwd(), 'bower.json')).name;
    } catch (e) {
      this.appname = path.basename(process.cwd());
    }
    this.appname = this._.slugify(this._.humanize(this.appname));
    this.scriptAppName = this._.camelize(this.appname) + genUtils.appSuffix(this);

    var name = this.name.replace(/\//g, '-');

    this.cameledName = this._.camelize(name);
    this.classedName = this._.classify(name);

    this.basename = path.basename(this.name);
    this.dirname = (this.name.indexOf('/') >= 0) ? path.dirname(this.name) : this.name;

    // dynamic assertion statements
    this.expect = function() {
      return this.filters.expect ? 'expect(' : '';
    }.bind(this);
    this.to = function() {
      return this.filters.expect ? ').to' : '.should';
    }.bind(this);

    // dynamic relative require path
    this.relativeRequire = function(to, fr) {
      fr = fr || this.filePath;
      return genUtils.relativeRequire(this, to, fr);
    }.bind(this);

    this.filters = this.config.get('filters');
    this.sourceRoot(path.join(__dirname, '/templates'));
  }
}
