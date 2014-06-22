'use strict';

// Environment variables that grunt will set when the server starts locally. Use for your api keys, secrets, etc.
// You will need to set these on the server you deploy to.
//
// This file should not be tracked by git.

module.exports = {
  SESSION_SECRET: "<%= _.slugify(_.humanize(appname)) + '-secret' %>",
  FACEBOOK_ID: "FACEBOOK-APP-ID",
  FACEBOOK_SECRET: "FACEBOOK-SECRET",
  TWITTER_ID: "TWITTER-APP-ID",
  TWITTER_SECRET: "TWITTER-SECRET",
  GOOGLE_ID: "GOOGLE-APP-ID",
  GOOGLE_SECRET: "GOOGLE-SECRET"
};