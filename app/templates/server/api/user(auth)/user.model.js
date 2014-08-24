'use strict';

var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var crypto    = require('crypto');


var CredentialSchema = new Schema({
  type: {
    type: String,
    "default": 'email',
    "enum": ['email', 'phone']
  },
  value: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  confirmed: {
    type: Boolean,
    "default": false
  }
}, { _id:false });



var UserSchema = new Schema({
  name: String,
  role: {
    type: String,
    "default": 'user'
  },
  username: String,
  salt: String,
  hashedPassword: String,

  credentials: [ CredentialSchema ]<% if (filters.oauth) { %>,

  //  NOTE: using `Mixed` is tricky. Should be changed to sth else.
  strategies: {
    type: Schema.Types.Mixed,
    "default": {}
  },
  localEnabled: {
    type: Boolean,
    "default": false
  }<% } %>
});

UserSchema
.virtual('password')
.set(function(pwd) {
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(pwd);

  <% if (filters.oauth) { %>// Setting password implies enabling LocalStrategy
  this.localEnabled = true;<% } %>
});

UserSchema
.path('hashedPassword')<% if (filters.oauth) { %>
.validate(function(hashedPwd) {
  return !!this.emails.length;

}, 'Cannot set password with empty email')<% } %>
.validate(function(hashedPwd) {<% if (filters.oauth) { %>
  if (!this.localEnabled) return true;<% } %>

  return !!hashedPwd.length;
}, 'Password cannot be blank');

UserSchema
.virtual('email')
.set(function(email) {
  this.credentials.push({
    value: email
  });

}).get(function() {
  // returns only first found email
  // TODO: in case of multiple emails, should prioritize confirmed ones
  return this.credentials.filter(function(c) {
    return c.type === 'email';

  })[0].value;
});

UserSchema
.virtual('emails')
.get(function() {
  return this.credentials
    .filter(function(c) { return c.type === 'email'; })
    .map(function(c) { return c.value; });

});

UserSchema
.pre('save', function(next) {<% if (filters.oauth) { %>
  if(!this.localEnabled) {
    if (Object.keys(this.strategies).length === 0) {
      return next(new Error('No connected accounts'));
    }
    return next();
  }<% } %>

  mongoose.models.User<% if (filters.oauth) { %>
    .find({ localEnabled:true })<% } %>
    .where('credentials.type').equals('email')
    .where('credentials.value').equals(this.email)
    .where('_id').ne(String(this._id))
    .exec(function(err, users) {
      if (users.length) {
        return next(new Error('Account with this email address already exists'));
      }
      next();
    });

});

UserSchema.methods = {
  authenticate: function(pwd) {
    return this.hashedPassword === this.encryptPassword(pwd);
  },
  encryptPassword: function(pwd) {
    var salt;
    if (!pwd || !this.salt) {
      return null;
    }
    salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(pwd, salt, 10000, 64).toString('base64');
  },
  confirm: function(emailOrPhone, cb) {
    this.credentials.forEach(function(c) {
      if (c.value === emailOrPhone) {
        c.confirmed = true;
      }
    });
    this.save(cb);
  },
  changeEmail: function(oldEmail, newEmail, cb) {
    this.credentials.forEach(function(c) {
      if (c.value === oldEmail) {
        c.value = newEmail;
        c.confirmed = false;
      }
    });
    this.save(cb);
  },
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  }<% if (filters.oauth) { %>,
  absorb: function(name, profile) {
    if (!this.strategies[name]) {
      this.strategies[name] = profile;
      this.markModified('strategies');
      this.save();
    } else {
      // TODO: move current to archive, and save current as current
      console.log("update profile");
    }
  }<% } %>
};

UserSchema.statics = {
  findOneByEmail: function(email, cb) {
    this.find({ 'credentials.value': email.toLowerCase() })
    .where('credentials.type').equals('email')
    .exec(function(err, user) {
      if (err) return cb(err);
      if (user.length === 0) return cb(null, null);

      cb(null, user[0]);
    });
  }<% if (filters.oauth) { %>,
  findDuplicates: function(data, cb) {
    var dataFormatted;
    dataFormatted = [];

    if (data.email !== null) {
      dataFormatted.push({
        'credentials.type': 'email',
        'credentials.value': data.email
      });
    }

    if (data.phone !== null) {
      dataFormatted.push({
        'credentials.type': 'phone',
        'credentials.value': data.phone
      });
    }

    this.find({ 'credentials.confirmed':true })
    .or(dataFormatted)
    .exec(function(err, users) {
      if (err) return cb(err);
      if (users.length === 0) return cb(null, null);

      cb(null, users);
    });
  }<% } %>
};

module.exports = mongoose.model('User', UserSchema);
