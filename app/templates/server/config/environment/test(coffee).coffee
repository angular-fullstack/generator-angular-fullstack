'use strict'

# Test specific configuration
# ===========================

# MongoDB connection options
module.exports =
  mongo:
    uri: 'mongodb://localhost/<%= _.slugify(appname) %>-test'
