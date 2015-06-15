'use strict';

var crypto = require('crypto');<% if(filters.oauth) { %>
var authTypes = ['github', 'twitter', 'facebook', 'google'];<% } %>

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    email   : { type: DataTypes.STRING, allowNull: false, unique: true },
    role    : { type: DataTypes.STRING, defaultValue: 'user' },
    salt    : { type: DataTypes.STRING }<% if (filters.oauth) { %>,<% if (filters.facebookAuth) { %>
    facebook: {},<% } %><% if (filters.twitterAuth) { %>
    twitter : {},<% } %><% if (filters.googleAuth) { %>
    google  : {},<% } %>
    github  : {} <% } %>
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Thing)
      }
    }
  });

  return User;
};
