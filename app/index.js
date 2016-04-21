'use strict';

// Register the Babel require hook
require('babel-register')({
  only: /generator-angular-fullstack\/(?!node_modules)/
});

// Export the generator
module.exports = require('./generator').default;
