import angular from 'angular';

export class FooterComponent {}

export default angular.module('directives.footer', [])
  .component('footer', {
    template: require('./footer.<%= templateExt %>'),
    controller: FooterComponent
  })
  .name;
