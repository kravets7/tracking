(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('UserDeliveriesController', UserDeliveriesController);

    /** @ngInject */
    function UserDeliveriesController($scope, $timeout, toastr, moment) {
        $timeout(function () {
            $scope.posts = [];
        });

        $scope.getTime = function (time) {
            return moment(new Date(+time)).format('LLLL');
        };
    }
})();