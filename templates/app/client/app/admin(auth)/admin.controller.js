'use strict';

(function() {

class AdminController {
  <%_ if(filters.ts || filters.flow) { _%>
  users: Object[];

  <%_ } _%>
  constructor(User) {
    // Use the User $resource to fetch all users
    this.users = User.query();
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}

angular.module('<%= scriptAppName %>.admin')
  .controller('AdminController', AdminController);

})();
