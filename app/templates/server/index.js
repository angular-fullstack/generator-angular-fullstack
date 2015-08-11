'use strict';<% if (filters.babel) { %>

// Register the Babel require hook
require('babel-core/register');<% } %>

// Export the application
exports = module.exports = require('./app');
