const antwar = require('antwar');

const environment = process.env.npm_lifecycle_event || 'build';

// Patch Babel env to make HMR switch work
process.env.BABEL_ENV = environment;

antwar[environment]({
  environment,
  antwar: require('./antwar.config'),
  webpack: require('./webpack.config')
}).catch(function (err) {
  console.error(err);
});
