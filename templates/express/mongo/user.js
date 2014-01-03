'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  authTypes = ['github', 'twitter', 'facebook', 'google'],
  SALT_WORK_FACTOR = 10;

/**
 * User Schema
 */
var UserSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  role: String,
  hashedPassword: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {}
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password, this.salt);
  }).get(function() {
    return this._password;
  });

UserSchema
  .virtual('userInfo')
  .get(function() {
    return {
      'email': this.email,
      'role': this.role
    };
  });
    
/**
 * Validations
 */
var validatePresenceOf = function(value) {
  return value && value.length;
};

UserSchema.path('email').validate(function(email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('hashedPassword').validate(function(hashedPassword) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashedPassword.length;
}, 'Password cannot be blank');

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.hashedPassword) && authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid password'));
  else
    next();
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return bcrypt.genSaltSync(SALT_WORK_FACTOR);
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password, salt) {
    // hash the password using our new salt
    return bcrypt.hashSync(password, salt);
  }
};

mongoose.model('User', UserSchema);