(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('AdminAdminsController', AdminAdminsController);

    /** @ngInject */
    function AdminAdminsController($scope, toastr, moment, FirebaseRef, $firebaseArray, FirebaseAuth, $state, StorageRef, LoginService) {
        $scope.photo = 'assets/icons/administrator.png';
        var AdminsRef = FirebaseRef.child('admins');
        $scope.admins = $firebaseArray(AdminsRef);

        $scope.registerData = {
            role: 'admin'
        };
        $scope.upload = false;

        $scope.change = function () {
            console.log('tut');
            var file = document.getElementById('fileD').files[0];
            if (file) {
                $scope.upload = true;
                StorageRef.child(file.name).put(file).then(function (snapshot) {
                    console.log('respa');
                    $scope.registerData.photoUrl = snapshot.downloadURL;
                    $scope.photo = $scope.registerData.photoUrl;
                    $scope.upload = false;
                });
            }
        };

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
                        FirebaseRef.child('admins')
                            .child(userData.uid)
                            .set({
                                email: $scope.registerData.email,
                                firstName: $scope.registerData.firstName,
                                surname: $scope.registerData.surname,
                                middleName: $scope.registerData.middleName,
                                role: $scope.registerData.role,
                                phoneNumber: $scope.registerData.phoneNumber,
                                photoUrl: $scope.registerData.photoUrl
                            });
                        LoginService.login();
                    }, function(error) {
                        console.log(error);
                        toastr.error(error.message, 'Error');
                    });
                }).catch(function(error) {
                console.error("Error: ", error);
            });
        };
    }
})();