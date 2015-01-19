exports.setup = (User, config) ->
  passport = require 'passport'
  TwitterStrategy = require('passport-twitter').Strategy

  passport.use new TwitterStrategy(
    consumerKey: config.twitter.clientID
    consumerSecret: config.twitter.clientSecret
    callbackURL: config.twitter.callbackURL
  , (token, tokenSecret, profile, done) ->
    User.findOne
      'twitter.id_str': profile.id
    , (err, user) ->
      return done(err)  if err
      if not user
        user = new User(
          name: profile.displayName
          username: profile.username
          role: 'user'
          provider: 'twitter'
          twitter: profile._json
        )
        user.save (err) ->
          return done(err)  if err
          done err, user
      else
        done err, user
  )
