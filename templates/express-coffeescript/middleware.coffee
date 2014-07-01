'use strict'

###
  Custom middleware used by the application
###
module.exports =

  ###
    Protect routes on your api from unauthenticated access
  ###
  auth: (req, res, next) ->
    return res.send(401) unless req.isAuthenticated()
    next()

  ###
    Set a cookie for angular so it knows we have an http session
  ###
  setUserCookie: (req, res, next) ->
    if req.user
      res.cookie 'user', JSON.stringify(req.user.userInfo)

    next()
