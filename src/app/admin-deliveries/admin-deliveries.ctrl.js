(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('AdminDeliveriesController', AdminDeliveriesController);

    /** @ngInject */
    function AdminDeliveriesController($scope, toastr, moment, FirebaseRef, $firebaseArray, FirebaseAuth, $state) {
        FirebaseAuth.onAuthStateChanged(function(user) {
            var DeliveriesRef = FirebaseRef.child('deliveries');
            $scope.deliveries = $firebaseArray(DeliveriesRef);
        });

        $scope.showRoute = function(number) {
            $state.go('app.admin-tracking', {
                obj: {
                    number: number
                }
            });
        };

        $scope.getTime = function (time) {
            return moment(new Date(+time)).format('LLLL');
        };
    }
})();