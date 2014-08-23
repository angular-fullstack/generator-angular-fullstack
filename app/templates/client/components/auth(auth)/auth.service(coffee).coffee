'use strict'

angular.module '<%= scriptAppName %>'
.factory 'Auth', ($location, $rootScope, $http, User, $cookieStore, $q) ->
  currentUser = if $cookieStore.get 'token' then User.get() else {}

  ###
  Authenticate user and save token

  @param  {Object}   user     - login info
  @param  {Function} callback - optional
  @return {Promise}
  ###
  login: (user, callback) ->
    deferred = $q.defer()
    $http.post '/auth/local',
      email: user.email
      password: user.password

    .success (data) ->
      $cookieStore.put 'token', data.token
      currentUser = User.get()
      deferred.resolve data
      callback?()

    .error (err) =>
      @logout()
      deferred.reject err
      callback? err

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
    User.save user,
      (data) ->
        $cookieStore.put 'token', data.token
        currentUser = User.get()
        callback? user

      , (err) =>
        @logout()
        callback? err

    .$promise


  ###
  Change password

  @param  {String}   oldPassword
  @param  {String}   newPassword
  @param  {Function} callback    - optional
  @return {Promise}
  ###
  changePassword: (oldPassword, newPassword, callback) ->
    User.changePassword
      id: currentUser._id
    ,
      oldPassword: oldPassword
      newPassword: newPassword

    , (user) ->
      callback? user

    , (err) ->
      callback? err

    .$promise

<% if (filters.oauth) { %>
  ###
  Set password (vel create LocalStrategy)

  @param  {String}   newPassword
  @param  {Function} callback    - optional
  @return {Promise}
  ###
  setPassword: (newPassword, callback) ->
    User.setPassword
      id: currentUser._id
    ,
      newPassword: newPassword

    , (user) ->
      callback? user

    , (err) ->
      callback? err

    .$promise
<% } %>
  ###
  Change email

  @param  {String}   email
  @param  {Function} callback   - optional
  @return {Promise}
  ###
  changeEmail: (oldEmail, newEmail, callback) ->
    User.changeEmail
      id: currentUser._id
    ,
      oldEmail: oldEmail
      newEmail: newEmail

    , (user) ->
      callback? user

    , (err) ->
      callback? err

    .$promise


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
  isLoggedInAsync: (callback) ->
    if currentUser.hasOwnProperty '$promise'
      currentUser.$promise.then ->
        callback? true
        return
      .catch ->
        callback? false
        return

    else
      callback? currentUser.hasOwnProperty 'role'

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
