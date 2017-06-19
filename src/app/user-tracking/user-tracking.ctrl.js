(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('UserTrackingController', UserTrackingController);

    /** @ngInject */
    function UserTrackingController($scope, $timeout, toastr, FirebaseRef, $firebaseObject, RoadService, $stateParams) {
        var CitiesRef = FirebaseRef.child('cities');
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
                        var driverPoints = driver.points || [];
                        RoadService.getItem(driverPoints)
                            .success(function (res) {
                                var bounds = new google.maps.LatLngBounds();
                                var city = $firebaseObject(CitiesRef.child(delivery.recipientLocation)).$loaded();
                                city.then(function (data) {
                                    console.log(data);
                                    var cityMarker = new google.maps.Marker({
                                        position: {
                                            lat: data.latitude,
                                            lng: data.longitude
                                        },
                                        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                                    });
                                    var loc = new google.maps.LatLng(data.latitude, data.longitude);
                                    bounds.extend(loc);
                                    cityMarker.setMap(map);
                                    var road = res.snappedPoints.map(function (item) {
                                        var loc = new google.maps.LatLng(item.location.latitude, item.location.longitude);
                                        bounds.extend(loc);
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
                                        strokeWeight: 4
                                    });
                                    var startMarker = new google.maps.Marker({
                                        position: road[0],
                                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                                    });
                                    var endMarker = new google.maps.Marker({
                                        position: road[road.length - 1],
                                        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                                    });
                                    startMarker.setMap(map);
                                    endMarker.setMap(map);
                                    flightPath.setMap(map);
                                    var loc2 = new google.maps.LatLng(endMarker.position.lat(), endMarker.position.lng());
                                    bounds.extend(loc2);
                                    map.fitBounds(bounds);
                                    map.panToBounds(bounds);
                                });
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
    }
})();