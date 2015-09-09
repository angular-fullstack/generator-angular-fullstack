'use strict';

var path = require('path');
var fs = require('fs');

exports = module.exports = {
  gitCmd: function gitCmd(args, opts, done) {
    grunt.util.spawn({
      cmd: process.platform === 'win32' ? 'git.cmd' : 'git',
      args: args,
      opts: opts || {}
    }, done);
  },

  gitCmdAsync: function gitCmdAsync(args, opts) {
    return function() {
      var deferred = Q.defer();
      gitCmd(args, opts, function(err) {
        if (err) { return deferred.reject(err); }
        deferred.resolve();
      });
      return deferred.promise;
    };
  },

  conventionalChangelog: {
    finalizeContext: function(context, writerOpts, commits, keyCommit) {
      var gitSemverTags = context.gitSemverTags;
      var commitGroups = context.commitGroups;

      if ((!context.currentTag || !context.previousTag) && keyCommit) {
        var match = /tag:\s*(.+?)[,\)]/gi.exec(keyCommit.gitTags);
        var currentTag = context.currentTag = context.currentTag || match ? match[1] : null;
        var index = gitSemverTags.indexOf(currentTag);
        var previousTag = context.previousTag = gitSemverTags[index + 1];

        if (!previousTag) {
          if (options.append) {
            context.previousTag = context.previousTag || commits[0] ? commits[0].hash : null;
          } else {
            context.previousTag = context.previousTag || commits[commits.length - 1] ? commits[commits.length - 1].hash : null;
          }
        }
      } else {
        context.previousTag = context.previousTag || gitSemverTags[0];
        context.currentTag = context.currentTag || 'v' + context.version;
      }

      if (typeof context.linkCompare !== 'boolean' && context.previousTag && context.currentTag) {
        context.linkCompare = true;
      }

      if (Array.isArray(commitGroups)) {
        for (var i = 0, commitGroupsLength = commitGroups.length; i < commitGroupsLength; i++) {
          var commits = commitGroups[i].commits;
          if (Array.isArray(commits)) {
            for (var n = 1, commitsLength = commits.length; n < commitsLength; n++) {
              var commit = commits[n], prevCommit = commits[n - 1];
              if (commit.scope && commit.scope === prevCommit.scope) {
                commit.subScope = true;
                if (prevCommit.scope && !prevCommit.subScope) {
                  prevCommit.leadScope = true;
                }
              }
            }
          }
        }
      }
      return context;
    },
    commitPartial: fs.readFileSync(path.resolve(__dirname, 'changelog-templates', 'commit.hbs')).toString()
  }
};
