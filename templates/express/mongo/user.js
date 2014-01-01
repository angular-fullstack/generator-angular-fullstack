/**
 * Module dependencies.
 */
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
    hashed_password: String,
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
        this.hashed_password = this.encryptPassword(password, this.salt);
    }).get(function() {
        return this._password;
    });

UserSchema
    .virtual('userInfo')
    .get(function() {
        return {
            '_id': this._id,
            'email': this.email
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

UserSchema.path('hashed_password').validate(function(hashed_password) {
    // if you are authenticating by any of the oauth strategies, don't validate
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return hashed_password.length;
}, 'Password cannot be blank');

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.hashed_password) && authTypes.indexOf(this.provider) === -1)
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
        return this.encryptPassword(plainText, this.salt) === this.hashed_password;
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