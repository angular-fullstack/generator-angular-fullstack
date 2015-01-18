'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://<%= mongoServer %>/<%= _.slugify(appname) %>-dev'
  },

  seedDB: true
};
