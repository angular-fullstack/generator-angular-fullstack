'use strict';

// Environment variables that Grunt will start the server with.
// Add your settings to a local process_env.js, that will not be tracked by git
module.exports = {
  SESSION_SECRET: "<%= _.slugify(_.humanize(appname)) + '-secret' %>",
  FACEBOOK_ID: "FACEBOOK-APP-ID",
  FACEBOOK_SECRET: "FACEBOOK-SECRET",
  TWITTER_ID: "TWITTER-APP-ID",
  TWITTER_SECRET: "TWITTER-SECRET",
  GOOGLE_ID: "GOOGLE-APP-ID",
  GOOGLE_SECRET: "GOOGLE-SECRET"
};