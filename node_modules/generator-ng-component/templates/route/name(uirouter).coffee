'use strict'

angular.module '<%= scriptAppName %>'
.config ($stateProvider) ->
  $stateProvider.state '<%= name %>',
    url: '<%= route %>'
    templateUrl: '<%= htmlUrl %>'
    controller: '<%= classedName %>Ctrl'
