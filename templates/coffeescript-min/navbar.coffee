'use strict'

angular.module('<%= scriptAppName %>')
  .controller 'NavbarCtrl', ['$scope', '$location', ($scope, $location) ->
    $scope.menu = [
      title: 'Home'
      link: '/'
    ,
      title: 'About'
      link: '#'
    ,
      title: 'Contact'
      link: '#'
    <% if(mongo && mongoPassportUser) { %>, 
      title: 'Sign Up'
      link: '#/signup'
    ,
      title: 'Login'
      link: '#/login'
    }<% } %>
    ]
    $scope.isActive = (route) ->
      route is $location.path()
  ]