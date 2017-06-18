(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('NextController', NextController);

    /** @ngInject */
    function NextController($scope, toastr, $state, $stateParams, FirebaseRef, StorageRef, FirebaseAuth, LocalStorage) {
        console.log($stateParams);
        $scope.photoUrl = 'assets/icons/user.png';
        if ($stateParams.data) {
            $scope.uid = $stateParams.data.uid;
            $scope.registerData = {
                role: 'user',
                email: $stateParams.data.email,
                firstName: $stateParams.data.firstName,
                surname: $stateParams.data.surname,
                photoUrl: $stateParams.data.photoUrl
            };
            $scope.photoUrl = $stateParams.data.photoUrl;
        } else $state.go('auth');
        $scope.upload = false;

        document.getElementById('file').addEventListener('change', function (event) {
            var file = event.target.files[0];
            if (file) {
                $scope.upload = true;
                StorageRef.child(file.name).put(file).then(function (snapshot) {
                    $scope.registerData.photoUrl = snapshot.downloadURL;
                    $scope.photoUrl = snapshot.downloadURL;
                    $scope.upload = false;
                });
            }
        });

        $scope.register = function (event) {
            event.preventDefault();
            console.log($scope.registerData);
            LocalStorage.setItem('role', 'users');
            FirebaseRef.child('users')
                .child($scope.uid)
                .set({
                    email: $scope.registerData.email,
                    firstName: $scope.registerData.firstName,
                    surname: $scope.registerData.surname,
                    middleName: $scope.registerData.middleName,
                    role: $scope.registerData.role,
                    phoneNumber: $scope.registerData.phoneNumber,
                    photoUrl: $scope.registerData.photoUrl
                }, function (err) {
                    if (err) {
                        console.log(err);
                        toastr.error(err.message);
                    } else $state.go('app.user-deliveries');
                });
        };

        $scope.goTo = function (route) {
            $state.go(route);
        };
    }
})();