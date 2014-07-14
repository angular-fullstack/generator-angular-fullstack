'use strict'

angular.module('<%= scriptAppName %>').factory 'Auth', ($location, $rootScope, $http, User, $cookieStore, $q) ->
  currentUser = {}
  currentUser = User.get() if $cookieStore.get('token')

  ###
  Authenticate user and save token

  @param  {Object}   user     - login info
  @param  {Function} callback - optional
  @return {Promise}
  ###
  login: (user, callback) ->
    cb = callback or angular.noop
    deferred = $q.defer()
    $http.post('/auth/local',
      email: user.email
      password: user.password
    ).success((data) ->
      $cookieStore.put 'token', data.token
      currentUser = User.get()
      deferred.resolve data
      cb()
    ).error ((err) ->
      @logout()
      deferred.reject err
      cb err
    ).bind(this)
    deferred.promise


  ###
  Delete access token and user info

  @param  {Function}
  ###
  logout: ->
    $cookieStore.remove 'token'
    currentUser = {}
    return


  ###
  Create a new user

  @param  {Object}   user     - user info
  @param  {Function} callback - optional
  @return {Promise}
  ###
  createUser: (user, callback) ->
    cb = callback or angular.noop
    User.save(user, (data) ->
      $cookieStore.put 'token', data.token
      currentUser = User.get()
      cb user
    , ((err) ->
      @logout()
      cb err
    ).bind(this)).$promise


  ###
  Change password

  @param  {String}   oldPassword
  @param  {String}   newPassword
  @param  {Function} callback    - optional
  @return {Promise}
  ###
  changePassword: (oldPassword, newPassword, callback) ->
    cb = callback or angular.noop
    User.changePassword(
      id: currentUser._id
    ,
      oldPassword: oldPassword
      newPassword: newPassword
    , (user) ->
      cb user
    , (err) ->
      cb err
    ).$promise


  ###
  Gets all available info on authenticated user

  @return {Object} user
  ###
  getCurrentUser: ->
    currentUser


  ###
  Check if a user is logged in synchronously

  @return {Boolean}
  ###
  isLoggedIn: ->
    currentUser.hasOwnProperty 'role'


  ###
  Waits for currentUser to resolve before checking if user is logged in
  ###
  isLoggedInAsync: (cb) ->
    if currentUser.hasOwnProperty('$promise')
      currentUser.$promise.then(->
        cb true
        return
      ).catch ->
        cb false
        return

    else if currentUser.hasOwnProperty('role')
      cb true
    else
      cb false

  ###
  Check if a user is an admin

  @return {Boolean}
  ###
  isAdmin: ->
    currentUser.role is 'admin'


  ###
  Get auth token
  ###
  getToken: ->
    $cookieStore.get 'token'
