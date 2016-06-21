'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN: 'http://localhost:<%= devPort %>',
  SESSION_SECRET: '<%= lodash.slugify(appname) + "-secret" %>',<% if (filters.facebookAuth) { %>

  FACEBOOK_ID: 'app-id',
  FACEBOOK_SECRET: 'secret',<% } if (filters.twitterAuth) { %>

  TWITTER_ID: 'app-id',
  TWITTER_SECRET: 'secret',<% } if (filters.googleAuth) { %>

  GOOGLE_ID: 'app-id',
  GOOGLE_SECRET: 'secret',
<% } %>
  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
