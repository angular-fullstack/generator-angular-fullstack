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
var mongoose = require('mongoose'),
  User = mongoose.model('User');

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
                    message: 'This email is not registered.'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'This password is not correct.'
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
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'generator-angular-fullstack-supersecret!',
  }));

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
app.post('/auth/users', users.create);
app.get('/auth/users/:id', users.show);

// Session Routes
var session = require('./lib/controllers/session');
app.get('/auth/session', users.ensureAuthenticated, session.session);
app.post('/auth/session', session.login);
app.del('/auth/session', session.logout);
<% } %>
// Angular Routes
app.get('/partials/*', controllers.partials);
<% if(mongo && mongoPassportUser) { %>app.get('/*', function(req, res) {
  if(req.user) {
    res.cookie('user', JSON.stringify(req.user.user_info));
  }

  res.render('index.html');
});<% } %>
<% if(!mongoPassportUser) { %>app.get('/*', controllers.index);<% } %>

// Start server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});