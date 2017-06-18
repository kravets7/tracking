(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('AdminTrackingController', AdminTrackingController);

    /** @ngInject */
    function AdminTrackingController($scope, $timeout, toastr, FirebaseRef, $firebaseArray, RoadService, $stateParams) {
        var cities = $firebaseArray(FirebaseRef.child('cities'));
        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 48.6208, lng: 22.287883},
            zoom: 12
        });

        function makeTrack(delivery) {
            var driverId = delivery.driverId;
            FirebaseRef.child('drivers')
                .child(driverId)
                .once('value', function (driverSnap) {
                    if (driverSnap.exists()) {
                        var driver = driverSnap.val();
                        var driverPoints = driver.points;
                        RoadService.getItem(driverPoints)
                            .success(function (res) {
                                var road = res.snappedPoints.map(function (item) {
                                    return {
                                        lng: item.location.longitude,
                                        lat: item.location.latitude
                                    };
                                });
                                var flightPath = new google.maps.Polyline({
                                    path: road,
                                    geodesic: true,
                                    strokeColor: '#FF0000',
                                    strokeOpacity: 1.0,
                                    strokeWeight: 2
                                });
                                flightPath.setMap(map);
                            })
                            .error(function (err) {
                                toastr.error('Somethink went wrong! Please, try again later', 'Error');
                            });
                    }
                });
        }

        $scope.find = function (event) {
            if (event) event.preventDefault();
            FirebaseRef
                .child('deliveries')
                .child($scope.number)
                .once('value', function (snap) {
                    if (snap.exists()) {
                        makeTrack(snap.val());
                    } else {
                        console.log('af');
                        toastr.error('Delivery with this number not found', 'Error');
                    }
                });
        };

        if ($stateParams.obj && $stateParams.obj.number) {
            $scope.number = $stateParams.obj.number;
            $scope.find();
        }

        if ($stateParams.obj && $stateParams.obj.driver) {
            var id = $stateParams.obj.driver;
            FirebaseRef.child('drivers')
                .child(id)
                .once('value', function (snap) {
                    var driver = snap.val();
                    var lastPoint = driver.points[driver.points.length - 1];
                    var marker = new google.maps.Marker({
                        position: {
                            lat: lastPoint.latitude,
                            lng: lastPoint.longitude
                        },
                        map: map,
                        title: driver.firstName
                    });
                });
        }
    }
})();