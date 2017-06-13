(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('UserHomeController', UserHomeController);

    /** @ngInject */
    function UserHomeController($scope, $timeout, toastr, RestService, moment) {
        $timeout(function () {
            $scope.posts = [];
            RestService.feed()
                .success(function (res) {
                    console.log(res);
                    if (res.success) {
                        $scope.posts = res.data;
                    }
                })
                .error(function (err) {
                    console.log(err);
                });
        });

        $scope.getTime = function (time) {
            return moment(new Date(+time)).format('LLLL');
        };
    }
})();