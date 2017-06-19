(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('AdminDeliveriesController', AdminDeliveriesController);

    /** @ngInject */
    function AdminDeliveriesController($scope, toastr, moment, FirebaseRef, $firebaseArray, $state, NotificationService, $timeout, $mdToast) {
        var DeliveriesRef = FirebaseRef.child('deliveries');
        var CitiesRef = FirebaseRef.child('cities');
        var DriversRef = FirebaseRef.child('drivers');
        $scope.deliveries = $firebaseArray(DeliveriesRef);
        $scope.cities = $firebaseArray(CitiesRef);
        $scope.drivers = $firebaseArray(DriversRef);
        $scope.registerData = {};

        function findUser(email) {
            return FirebaseRef.child('users')
                .orderByChild('email')
                .equalTo(email)
                .once('value')
        }

        $scope.statusValues = ['Sent', 'Delivered', 'Obtained'];

        $scope.editItem = function (item) {
            item.newStatus = item.status;
            item.changed = true;
        };

        $scope.saveItem = function (item) {
            DeliveriesRef.child(item.id)
                .update({status: item.newStatus}, function (err) {
                    $scope.deliveries = $firebaseArray(DeliveriesRef);
                    NotificationService.setNewItem(item);
                });
        };

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

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        $scope.toastPosition = angular.extend({},last);

        $scope.getToastPosition = function() {
            sanitizePosition();

            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        };

        function sanitizePosition() {
            var current = $scope.toastPosition;

            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;

            last = angular.extend({},current);
        }

        $scope.showSimpleToast = function(mes) {
            var pinTo = $scope.getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent(mes)
                    .position(pinTo )
                    .hideDelay(3000)
            );
        };

        $scope.addDelivery = function () {
            $scope.registerData.id = $scope.deliveries.length + 1;
            $scope.registerData.status = 'Sent';
            $scope.registerData.sendDate = moment().format('DD.MM.YYYY');

            console.log($scope.registerData);
            if (!$scope.registerData.senderLocation ||
                !$scope.registerData.recipientLocation ||
                !$scope.registerData.driverId) {
                $scope.showSimpleToast('All fields are required');
                return;
            }
            findUser($scope.registerData.senderEmail)
                .then(function (userSnap) {
                    if (!userSnap.exists()) {
                        throw "Sender not found by email";
                    } else {
                        var sender = userSnap.val();
                        console.log(sender.firstName + ' ' + sender.middleName + ' ' + sender.surname);
                        $scope.registerData.senderId = userSnap.key;
                        $scope.registerData.senderName = sender.firstName + ' ' + sender.middleName + ' ' + sender.surname;
                        return findUser($scope.registerData.recipientEmail)
                    }
                })
                .then(function (userSnap) {
                    if (!userSnap.exists()) {
                        throw "Recipient not found by email";
                    } else {
                        var recipient = userSnap.val();
                        console.log(recipient.firstName + ' ' + recipient.middleName + ' ' + recipient.surname);
                        $scope.registerData.recipientId = userSnap.key;
                        $scope.registerData.recipientName = recipient.firstName + ' ' + recipient.middleName + ' ' + recipient.surname;
                        console.log($scope.registerData);
                        return DeliveriesRef.child($scope.registerData.id).set($scope.registerData);
                    }
                })
                .then(function (snap) {
                    NotificationService.setNewItem($scope.registerData);
                    $scope.registerData = {};
                    $scope.showSimpleToast('Delivery successfully created', 'Success');
                })
                .catch(function (err) {
                    console.log(err);
                    $scope.showSimpleToast(err.message || err);
                })
        };
    }
})();