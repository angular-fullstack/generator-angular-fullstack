'use strict';

(function() {

function AdminController(User) {
  // Use the User $resource to fetch all users
  var users = this.users = User.query();

  this.delete = function(user) {
    user.$remove();
    users.splice(users.indexOf(user), 1);
  };
}

angular.module('<%= scriptAppName %>.admin')
  .controller('AdminController', AdminController);

})();
