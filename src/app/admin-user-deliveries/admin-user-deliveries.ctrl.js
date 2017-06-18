(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('AdminUserDeliveriesController', AdminUserDeliveriesController);

    /** @ngInject */
    function AdminUserDeliveriesController($scope, toastr, moment, FirebaseRef, $firebaseArray, FirebaseAuth, $state, $stateParams) {

        if ($stateParams.data) {
            console.log('tut');
            var userId = $stateParams.data.userId;
            var DeliveriesRef = FirebaseRef.child('deliveries');
            $scope.recipientList = $firebaseArray(DeliveriesRef.orderByChild('recipientId').equalTo(userId));
            $scope.senderList = $firebaseArray(DeliveriesRef.orderByChild('senderId').equalTo(userId));
            console.log($scope.recipientList, $scope.senderList);
        }

        $scope.showRoute = function(number) {
            $state.go('app.user-tracking', {
                obj: {
                    number: number
                }
            });
        };
    }
})();