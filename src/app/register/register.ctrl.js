(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($scope, toastr, $state, $firebaseAuth, FirebaseRef, StorageRef, FirebaseAuth, LocalStorage) {
        var Auth = $firebaseAuth();
        $scope.registerData = {
            role: 'user'
        };
        $scope.upload = false;

        document.getElementById('file').addEventListener('change', function (event) {
            console.log('tut');
            var file = event.target.files[0];
            if (file) {
                $scope.upload = true;
                StorageRef.child(file.name).put(file).then(function (snapshot) {
                    console.log('respa');
                    $scope.registerData.photoUrl = snapshot.downloadURL;
                    $scope.upload = false;
                });
            }
        });

        $scope.register = function (event) {
            event.preventDefault();
            if ($scope.registerData.password !== $scope.registerData.confirmPassword) {
                toastr.error('Password and confirm password are different', 'Error');
                return;
            }

            console.log($scope.registerData);

            FirebaseAuth.createUserWithEmailAndPassword($scope.registerData.email, $scope.registerData.password)
                .then(function(userData) {
                    console.log(userData);
                    userData.sendEmailVerification().then(function() {
                        toastr.info('Verification email sent.', 'Info');
                        console.log('Verification email sent.');
                    }, function(error) {
                        console.log(error);
                        toastr.error(error.message, 'Error');
                    });
                    /*FirebaseRef.child('users')
                        .child(userData.uid)
                        .set({
                            email: $scope.registerData.email,
                            firstName: $scope.registerData.firstName,
                            surname: $scope.registerData.surname,
                            middleName: $scope.registerData.middleName,
                            role: $scope.registerData.role,
                            phoneNumber: $scope.registerData.phoneNumber,
                            photoUrl: $scope.registerData.photoUrl
                        })*/
                }).catch(function(error) {
                    console.error("Error: ", error);
                });
        };

        $scope.goTo = function (route) {
            $state.go(route);
        };
    }
})();