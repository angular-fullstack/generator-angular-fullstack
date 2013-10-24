'use strict';

angular.module('<%= scriptAppName %>')
    .config(['$provide', function ($provide) {
        $provide.decorator('<%= cameledName %>', function ($delegate) {
            // decorate the $delegate
            return $delegate;
        });
    }]);
