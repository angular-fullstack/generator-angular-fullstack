'use strict';

angular.module('<%= scriptAppName %>')
  .controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log('LoginCtrl');
    $scope.email = 'testusers@email.com';
    $scope.password = 'changeme';

    $scope.login = function() {
      console.log('login(email=' + $scope.email + ', password=' + $scope.password + ')');

      var credentials = {
        email: $scope.email,
        password: $scope.password
      };
      $http.post('/users/session', credentials).success(function() {
        console.log('Congratulartions, you are logged IN!');
      });
    };
  }]);

angular.module('<%= scriptAppName %>')
  .controller('LogoutCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log('LogoutCtrl');
    $http.get('/signout').success(function() {
      console.log('Congratulartions, you are logged OUT!');
    });
  }]);

angular.module('<%= scriptAppName %>')
  .controller('SignupCtrl', ['$scope', '$http', function ($scope, $http) {
    console.log('SignupCtrl');
    $scope.email = 'email';
    $scope.password = 'changeme';
  }]);