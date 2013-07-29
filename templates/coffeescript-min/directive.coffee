'use strict';

angular.module('<%= moduleName %>')
  .directive '<%= _.camelize(name) %>', [->
    template: '<div></div>'
    restrict: 'E'
    link: (scope, element, attrs) ->
      element.text 'this is the <%= _.camelize(name) %> directive'
  ]
