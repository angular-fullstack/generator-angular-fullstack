/**
 * Webpack config for development
 */
module.exports = require('./webpack.make')({
    BUILD: false,
    TEST: false,
    DEV: true
});
