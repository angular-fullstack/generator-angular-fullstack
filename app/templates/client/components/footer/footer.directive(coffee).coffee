'use strict'

angular.module '<%= scriptAppName %>'
.directive 'footer', ->
  templateUrl: 'components/footer/footer.html'
  restrict: 'E',
  link: (scope, element) ->
    element.addClass('footer')
