'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');<% if(filters.oauth) { %>
var authTypes = ['github', 'twitter', 'facebook', 'google'];<% } %>

var UserSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  role: {
    type: String,
    default: 'user'
  },
  password: String,
  provider: String,
  salt: String<% if (filters.oauth) { %>,<% if (filters.facebookAuth) { %>
  facebook: {},<% } %><% if (filters.twitterAuth) { %>
  twitter: {},<% } %><% if (filters.googleAuth) { %>
  google: {},<% } %>
  github: {}<% } %>
});

/**
 * Virtuals
 */

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {<% if (filters.oauth) { %>
    if (authTypes.indexOf(this.provider) !== -1) return true;<% } %>
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('password')
  .validate(function(password) {<% if (filters.oauth) { %>
    if (authTypes.indexOf(this.provider) !== -1) return true;<% } %>
    return password.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    // Handle new/update passwords
    if (this.password) {
      if (!validatePresenceOf(this.password)<% if (filters.oauth) { %> && authTypes.indexOf(this.provider) === -1<% } %>)
        next(new Error('Invalid password'));

      // Make salt with a callback
      var _this = this;
      this.makeSalt(function(saltErr, salt) {
        if (saltErr) next(saltErr);
        _this.salt = salt;
        // Async hash
        _this.encryptPassword(_this.password, function(encryptErr, hashedPassword) {
          if (encryptErr) next(encryptErr);
          _this.password = hashedPassword;
          next();
        });
      });
    } else {
      next();
    }
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @callback {callback} Optional callback
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText, callback) {
    if (!callback)
      return bcrypt.compareSync(plainText, this.password);

    return bcrypt.compare(plainText, this.password, callback);
  },

  /**
   * Make salt
   *
   * @param {Number} rounds Optional rounds, defaults to 10
   * @callback {callback} Optional callback
   * @return {String}
   * @api public
   */
  makeSalt: function(rounds, callback) {
    var defaultRounds = 10;

    if (typeof arguments[0] === 'function') {
      callback = arguments[0];
      rounds = defaultRounds;
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }

    if (!rounds)
      rounds = defaultRounds;

    if (!callback)
      return bcrypt.genSaltSync(rounds);

    return bcrypt.genSalt(rounds, callback);
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @callback {callback} Optional callback
   * @return {String}
   * @api public
   */
  encryptPassword: function(password, callback) {
    if (!password || !this.salt) {
      if (!callback) {
        return '';
      } else {
        callback(new Error('Need password and salt to create hash'));
      }
    }

    if (!callback)
      return bcrypt.hashSync(password, this.salt);

    return bcrypt.hash(password, this.salt, callback);
  }
};

module.exports = mongoose.model('User', UserSchema);
