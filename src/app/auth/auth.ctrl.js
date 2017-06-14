(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('AuthController', AuthController);

    /** @ngInject */
    function AuthController($scope, toastr, $state, $firebaseAuth, FirebaseRef, FirebaseAuth, LocalStorage) {
        var Auth = $firebaseAuth();
        $scope.providers = {
            g: new firebase.auth.GoogleAuthProvider(),
            f: new firebase.auth.FacebookAuthProvider()
        };
        var isNot = "Account is not ";
        $scope.consts = {
            admins: {
                value: 'admins',
                infoText: "Administrator"
            },
            users: {
                value: 'users',
                infoText: "User"
            }
        };
        $scope.authAs = 'admins';

        $scope.socialLogin = function (variant) {
            var provider = $scope.providers[variant];
            FirebaseAuth.signInWithPopup(provider)
                .then(function (result) {
                    console.log(result);
                })
                .catch(function (err) {
                    toastr.error(err.message, "Error");
                })
        };

        $scope.login = function (event) {
            event.preventDefault();
            Auth.$signInWithEmailAndPassword($scope.email, $scope.password)
                .then(function(authData) {
                    console.log("Logged in as:", authData.uid);
                    if (!authData.emailVerified) {
                        toastr.error("Your account is not verified! Please check your email", "Error");
                        return;
                    }
                    console.log($scope.consts[$scope.authAs].value);
                    FirebaseRef.child($scope.consts[$scope.authAs].value)
                        .child(authData.uid)
                        .once("value", function (userSnap) {
                            if (userSnap.exists()) {
                                LocalStorage.setItem('role', $scope.authAs);
                                $state.go('app.user-home');
                            } else {
                                toastr.error(isNot + $scope.consts[$scope.authAs].infoText, 'Error');
                            }
                        })
                }).catch(function(error) {
                    console.error("Authentication failed:", error);
                    toastr.error(error.message, 'Error');
                });
        };

        $scope.logout = function () {
            LocalStorage.removeItem('role');
            Auth.$unauth();
            $state.go('auth');
        };
    }
})();