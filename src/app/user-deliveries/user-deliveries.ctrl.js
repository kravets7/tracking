(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('UserDeliveriesController', UserDeliveriesController);

    /** @ngInject */
    function UserDeliveriesController($scope, toastr, moment, FirebaseRef, $firebaseArray, FirebaseAuth, $state) {
        FirebaseAuth.onAuthStateChanged(function(user) {
            var DeliveriesRef = FirebaseRef.child('deliveries');
            $scope.recipientList = $firebaseArray(DeliveriesRef.orderByChild('recipientId').equalTo(user.uid));
            $scope.senderList = $firebaseArray(DeliveriesRef.orderByChild('senderId').equalTo(user.uid));
            if ($scope.recipientList.length || $scope.senderList.length) $scope.checkListLength = true;
        });

        $scope.showRoute = function(number) {
            $state.go('app.user-tracking', {
                obj: {
                    number: number
                }
            });
        };

        $scope.checkListLength = false;

        $scope.getTime = function (time) {
            return moment(new Date(+time)).format('LLLL');
        };
    }
})();