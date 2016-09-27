import angular from 'angular';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar/navbar.<%= templateExt %>'),
    controller: NavbarComponent
  })
  .component('footer', {
    template: require('./footer/footer.<%= templateExt %>'),
    controller: FooterComponent
  })
  .name;
