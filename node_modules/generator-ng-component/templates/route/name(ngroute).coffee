'use strict'

angular.module '<%= scriptAppName %>'
.config ($routeProvider) ->
  $routeProvider.when '<%= route %>',
    templateUrl: '<%= htmlUrl %>'
    controller: '<%= classedName %>Ctrl'
