const autoprefixer = require('autoprefixer');

module.exports = (ctx) => ({
  plugins: [
    autoprefixer(ctx.plugin),
  ]
});
