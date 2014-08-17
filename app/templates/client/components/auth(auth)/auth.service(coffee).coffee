'use strict'

angular.module '<%= scriptAppName %>'
.factory 'Auth', ($http, User, $cookieStore, $q) ->
  currentUser = if $cookieStore.get 'token' then User.get() else {}

  ###
  Authenticate user and save token

  @param  {Object}   user     - login info
  @param  {Function} callback - optional, function(error)
  @return {Promise}
  ###
  login: (user, callback) ->
    $http.post '/auth/local',
      email: user.email
      password: user.password

    .then (res) ->
      $cookieStore.put 'token', res.data.token
      currentUser = User.get()
      callback?()
      res.data

    , (err) =>
      @logout()
      callback? err.data
      $q.reject err.data


  ###
  Delete access token and user info
  ###
  logout: ->
    $cookieStore.remove 'token'
    currentUser = {}
    return


  ###
  Create a new user

  @param  {Object}   user     - user info
  @param  {Function} callback - optional, function(error, user)
  @return {Promise}
  ###
  createUser: (user, callback) ->
    User.save user,
      (data) ->
        $cookieStore.put 'token', data.token
        currentUser = User.get()
        callback? null, user

      , (err) =>
        @logout()
        callback? err

    .$promise


  ###
  Change password

  @param  {String}   oldPassword
  @param  {String}   newPassword
  @param  {Function} callback    - optional, function(error, user)
  @return {Promise}
  ###
  changePassword: (oldPassword, newPassword, callback) ->
    User.changePassword
      id: currentUser._id
    ,
      oldPassword: oldPassword
      newPassword: newPassword

    , (user) ->
      callback? null, user

    , (err) ->
      callback? err

    .$promise


  ###
  Gets all available info on a user
    (synchronous|asynchronous)

  @param  {Function|*} callback - optional, funciton(user)
  @return {Object|Promise}
  ###
  getCurrentUser: (callback) ->
    return currentUser  if arguments.length is 0

    value = if (currentUser.hasOwnProperty("$promise")) then currentUser.$promise else currentUser
    $q.when value

    .then (user) ->
      callback? user
      user

    , ->
      callback? {}
      {}


  ###
  Check if a user is logged in
    (synchronous|asynchronous)

  @param  {Function|*} callback - optional, function(is)
  @return {Bool|Promise}
  ###
  isLoggedIn: (callback) ->
    return currentUser.hasOwnProperty("role")  if arguments.length is 0

    @getCurrentUser null

    .then (user) ->
      is_ = user.hasOwnProperty("role")
      callback? is_
      is_


  ###
  Check if a user is an admin
    (synchronous|asynchronous)

  @param  {Function|*} callback - optional, function(is)
  @return {Bool|Promise}
  ###
  isAdmin: (callback) ->
    return currentUser.role is "admin"  if arguments_.length is 0

    @getCurrentUser null

    .then (user) ->
      is_ = user.role is "admin"
      callback? is_
      is_


  ###
  Get auth token
  ###
  getToken: ->
    $cookieStore.get 'token'
