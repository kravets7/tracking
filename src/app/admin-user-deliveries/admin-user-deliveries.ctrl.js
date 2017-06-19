(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('AdminUserDeliveriesController', AdminUserDeliveriesController);

    /** @ngInject */
    function AdminUserDeliveriesController($scope, toastr, moment, FirebaseRef, $firebaseArray, FirebaseAuth, $state, $stateParams, NotificationService) {

        if ($stateParams.data) {
            console.log('tut');
            var userId = $stateParams.data.userId;
            var DeliveriesRef = FirebaseRef.child('deliveries');
            $scope.recipientList = $firebaseArray(DeliveriesRef.orderByChild('recipientId').equalTo(userId));
            $scope.senderList = $firebaseArray(DeliveriesRef.orderByChild('senderId').equalTo(userId));
            console.log($scope.recipientList, $scope.senderList);
        }

        $scope.statusValues = ['Sent', 'Delivered', 'Obtained'];

        $scope.editItem = function (item) {
            item.newStatus = item.status;
            item.changed = true;
        };

        $scope.saveItem = function (item) {
            DeliveriesRef.child(item.id)
                .update({status: item.newStatus}, function (err) {
                    $scope.recipientList = $firebaseArray(DeliveriesRef.orderByChild('recipientId').equalTo(userId));
                    $scope.senderList = $firebaseArray(DeliveriesRef.orderByChild('senderId').equalTo(userId));
                    NotificationService.setNewItem(item);
                });
        };

        $scope.showRoute = function(number) {
            $state.go('app.user-tracking', {
                obj: {
                    number: number
                }
            });
        };
    }
})();