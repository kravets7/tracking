(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('UserTrackingController', UserTrackingController);

    /** @ngInject */
    function UserTrackingController($scope, $timeout, toastr, moment) {
        $timeout(function () {
            $scope.posts = [];
        });

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 48.6208, lng: 22.287883},
            zoom: 12
        });

        $scope.getTime = function (time) {
            return moment(new Date(+time)).format('LLLL');
        };
    }
})();