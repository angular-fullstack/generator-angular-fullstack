
var path = require('path'),
  util = require('util'),
  yeoman = require('yeoman');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.option('coffee');
  this.option('minsafe');
  
  var args = ['main'];

  if (this.options.coffee) {
    args.push('--coffee');
  }

  if (this.options.minsafe) {
    args.push('--minsafe');
  }

  this.hookFor('angular:common', {
    args: args
  });

  this.hookFor('angular:app', {
    args: args
  });
  this.hookFor('angular:controller', {
    args: args
  });

  this.hookFor('testacular:app', {
    args: [false] // run testacular hook in non-interactive mode
  });
};

util.inherits(Generator, yeoman.generators.NamedBase);

function checkTestacular() {
  try {
    var testacular = require('testacular'),
        colors = require('colors');

    //TODO: check a global dependency instead of hardcoding it.
    //also know the minimum usable version. For now using the latest version (0.4.0).
    function isLowerVersion(current, minimum) {
      var i, min, cur;

      current = current.split('.');
      minimum = minimum.split('.');

      for (i in minimum) {
        cur = parseInt(current[i], 10);
        min = parseInt(minimum[i], 10);
        
        if (cur < min) {
          return true;
        } else if (cur > min) {
          return false;
        }
      }
      return false;
    }
    if(isLowerVersion(testacular.VERSION, '0.4.0')) {
      console.log('\n✖ Testacular [outdated]\n'.yellow +
      '  You\'re ready to start using Angular, but Testacular is out of date.\n'.grey +
      '  To update it, run '.grey + 'sudo npm update -g testacular');
    }
  } catch (err) {
    //only bother if it's not installed
    console.log('\n✖ Testacular [not installed]\n'.red +
    '  You\'re ready to start using Angular but if you\'re planning to \n'.grey +
    '  unit test (and why you wouldn\'t?) you need Testacular.\n'.grey +
    '  Get it by running '.grey + 'sudo npm install -g testacular');
  }
}

Generator.prototype.askFor = function askFor(argument) {
  var cb = this.async();
  var self = this;

  checkTestacular();

  var prompts = [{
    name: 'bootstrap',
    message: 'Would you like to include Twitter Bootstrap?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }, {
    name: 'compassBootstrap',
    message: 'If so, would you like to use Twitter Bootstrap for Compass (as opposed to vanilla CSS)?',
    default: 'Y/n',
    warning: 'Yes: All Twitter Bootstrap files will be placed into the styles directory.'
  }];

  this.prompt(prompts, function(e, props) {
    if (e) {
      return self.emit('error', e);
    }
    self.bootstrap = (/y/i).test(props.bootstrap);
    self.compassBootstrap = (/y/i).test(props.compassBootstrap);

    // we're done, go through next step
    cb();
  });
};

// Duplicated from the SASS generator, waiting a solution for #138
Generator.prototype.bootstrapFiles = function bootstrapFiles() {
  if ( this.compassBootstrap ) {
    var cb = this.async();

    this.write('app/styles/main.scss', '@import "compass_twitter_bootstrap";');

    this.remote('kristianmandrup', 'compass-twitter-bootstrap', 'c3ccce2cca5ec52437925e8feaaa11fead51e132', function(err, remote) {
      if(err) {
        return cb(err);
      }

      remote.directory('stylesheets', 'app/styles');

      cb();
    });
  } else if (this.bootstrap) {
    this.log.writeln('Writing compiled Bootstrap');
    this.copy( 'bootstrap.css', 'app/styles/bootstrap.css' ); // this is probably wrong dir
  }
};
