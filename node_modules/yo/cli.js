#!/usr/bin/env node
'use strict';
var fs = require('fs');
var path = require('path');
var nopt = require('nopt');
var chalk = require('chalk');
var pkg = require('./package.json');
var _ = require('lodash');
var updateNotifier = require('update-notifier');
var sudoBlock = require('sudo-block');
var isRoot = require('is-root');
var Insight = require('insight');
var yosay = require('yosay');
var stringLength = require('string-length');

var opts = nopt({
  help: Boolean,
  version: Boolean
});

var args = opts.argv.remain;
var cmd = args[0];

function rootCheck() {
  if (isRoot() && process.setuid) {
    try {
      // Try to force yo to run on a safe uid
      process.setuid(501);
    } catch (err) {}
  }

  var msg = chalk.red('Easy with the "sudo"; Yeoman is the master around here.') + '\n\n\
Since yo is a user command, there is no need to execute it with superuser\n\
permissions. If you\'re having permission errors when using yo without sudo,\n\
please spend a few minutes learning more about how your system should work\n\
and make any necessary repairs.\n\n\
A quick solution would be to change where npm stores global packages by\n\
putting ~/npm/bin in your PATH and running:\n' + chalk.blue('npm config set prefix ~/npm') + '\n\n\
Reading material:\n\
http://www.joyent.com/blog/installing-node-and-npm\n\
https://gist.github.com/isaacs/579814\n';

  sudoBlock(msg);
}

function pre() {
  if (opts.version) {
    console.log(pkg.version);
    return;
  }

  // debugging helper
  if (cmd === 'doctor') {
    require('yeoman-doctor').run();
    return;
  }

  // easteregg
  if (cmd === 'yeoman' || cmd === 'yo') {
    console.log(require('yeoman-character'));
    return;
  }

  init();
}

function init() {
  var env = require('yeoman-environment').createEnv();

  // alias any single namespace to `*:all` and `webapp` namespace specifically
  // to webapp:app.
  env.alias(/^([^:]+)$/, '$1:all');
  env.alias(/^([^:]+)$/, '$1:app');

  env.on('end', function () {
    console.log('Done running sir');
  });

  env.on('error', function (err) {
    console.error('Error', process.argv.slice(2).join(' '), '\n');
    console.error(opts.debug ? err.stack : err.message);
    process.exit(err.code || 1);
  });

  // lookup for every namespaces, within the environments.paths and lookups
  env.lookup(function () {
    // list generators
    if (opts.generators) {
      return console.log(_.uniq(Object.keys(env.getGeneratorsMeta()).map(function (el) {
        return el.split(':')[0];
      })).join('\n'));
    }

    // Register the `yo yo` generator.
    if (!cmd) {
      if (opts.help) {
        console.log(env.help('yo'));
        return;
      }

      env.register(path.resolve(__dirname, './yoyo'), 'yo');
      args = ['yo'];
      // make the insight instance available in `yoyo`
      opts = { insight: insight };
    }

    // Note: at some point, nopt needs to know about the generator options, the
    // one that will be triggered by the below args. Maybe the nopt parsing
    // should be done internally, from the args.
    env.run(args, opts);
  });
}

rootCheck();

var insightMsg = chalk.gray('\
==========================================================================') + chalk.yellow('\n\
We\'re constantly looking for ways to make ') + chalk.bold.red(pkg.name) + chalk.yellow(' better! \n\
May we anonymously report usage statistics to improve the tool over time? \n\
More info: https://github.com/yeoman/insight & http://yeoman.io') + chalk.gray('\n\
==========================================================================');

var insight = new Insight({
  trackingCode: 'UA-31537568-1',
  packageName: pkg.name,
  packageVersion: pkg.version
});

if (opts.insight === false) {
  insight.config.set('optOut', true);
} else if (opts.insight) {
  insight.config.set('optOut', false);
}

if (!process.env.yeoman_test && opts.insight !== false) {
  if (insight.optOut === undefined) {
    insight.optOut = insight.config.get('optOut');
    insight.track('downloaded');
    insight.askPermission(insightMsg, pre);
    return;
  }
  // only track the two first subcommands
  insight.track.apply(insight, args.slice(0, 2));
}

if (!process.env.yeoman_test && opts['update-notifier'] !== false) {
  var notifier = updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
  });

  var message = [];

  if (notifier.update) {
    message.push('Update available: ' + chalk.green.bold(notifier.update.latest) + chalk.gray(' (current: ' + notifier.update.current + ')'));
    message.push('Run ' + chalk.magenta('npm install -g ' + pkg.name) + ' to update.');
    console.log(yosay(message.join(' '), { maxLength: stringLength(message[0]) }));
  }
}

pre();
