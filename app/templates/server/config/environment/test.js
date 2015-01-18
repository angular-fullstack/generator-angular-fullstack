'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://<%= mongoServer %>/<%= _.slugify(appname) %>-test'
  }
};
