'use strict';

export default class AdminController {
  <%_ if(filters.ts || filters.flow) { _%>
  users: Object[];

  <%_ } _%>
  /*@ngInject*/
  constructor(User) {
    this.User = User;
  }

  $onInit() {
    this.users = this.User.query(); // Fetch all users
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}
