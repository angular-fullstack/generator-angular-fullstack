'use strict';

// Module dependencies.
var express = require('express'),
    path = require('path')<% if (mongo) { %>,
    fs = require('fs')<% } %><% if (mongo && mongoPassportUser) { %>,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy<% } %>;

var app = express();
<% if (mongo) { %>
// Connect to database
var db = require('./lib/db/mongo');

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

// Populate empty DB with dummy data
require('./lib/db/dummydata');
<% } %><% if(mongo && mongoPassportUser) { %>
// explicitly require the user model
var User = require('./lib/models/user');
//Serialize sessions
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({
        _id: id
    }, '-salt -hashed_password', function(err, user) { // don't ever give out the password or salt
        done(err, user);
    });
});

// just add more strategies for authentication flexibility
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
        User.findOne({
            email: email
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
            return done(null, user);
        });
    }
));<% } %>

// Express Configuration
app.configure('development', function(){
  app.use(require('connect-livereload')());
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
  app.set('views', __dirname + '/app/views');
});

app.configure('production', function(){
  app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('views', __dirname + '/views');
});

app.configure(function(){<% if (!jade) { %>
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');<% } %><% if (jade) { %>
  app.set('view engine', 'jade');<% } %>
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
  <% if(mongo && mongoPassportUser) { %>
  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());
  <% } %>
  // Router needs to be last
	app.use(app.router);
});

// Controllers
var api = require('./lib/controllers/api'),
    controllers = require('./lib/controllers');

// Server Routes
app.get('/api/awesomeThings', api.awesomeThings);
<% if(mongo && mongoPassportUser) { %>
// User Routes
var users = require('./lib/controllers/users');
app.get('/signin', users.signin);
app.get('/signup', users.signup);
app.get('/signout', users.signout);
app.get('/users/me', users.me);

//Setting up the users api
app.post('/users', users.create);

//Setting the local strategy route
app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
}), users.session);

//Finish with setting up the userId param
app.param('userId', users.user);
<% } %>
// Angular Routes
app.get('/partials/*', controllers.partials);
app.get('/*', controllers.index);

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});