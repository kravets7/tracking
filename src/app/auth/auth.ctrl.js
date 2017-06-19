(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('AuthController', AuthController);

    /** @ngInject */
    function AuthController($scope, toastr, $state, $firebaseAuth, FirebaseRef, FirebaseAuth, LocalStorage, $mdToast, LoginService) {
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
                    FirebaseRef.child('users')
                        .child(result.user.uid)
                        .once('value', function (userSnap) {
                            if (userSnap.exists()) {
                                $state.go('app.user-deliveries');
                                LocalStorage.setItem('role', 'users');
                            } else {
                                $state.go('nextRegisterStep', {data: {
                                    uid: result.user.uid,
                                    email: result.user.providerData[0].email,
                                    firstName: result.user.providerData[0].displayName.split(' ')[0],
                                    surname: result.user.providerData[0].displayName.split(' ')[1],
                                    photoUrl: result.user.providerData[0].photoURL
                                }});
                            }
                        });
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
                    LoginService.setItem($scope.email, $scope.password);
                    if (!authData.emailVerified) {
                        var pinTo = $scope.getToastPosition();
                        var toast = $mdToast.simple()
                            .textContent('Your account is not confirmed. Send verification email?')
                            .action('Send')
                            .position(pinTo);

                        $mdToast.show(toast).then(function(response) {
                            if ( response == 'ok' ) {
                                authData.sendEmailVerification().then(function() {
                                    toastr.info('Verification email sent.', 'Info');
                                    console.log('Verification email sent.');
                                }, function(error) {
                                    console.log(error);
                                    toastr.error(error.message, 'Error');
                                });
                            }
                        });
                        return;
                    }
                    FirebaseRef.child($scope.consts[$scope.authAs].value)
                        .child(authData.uid)
                        .once("value", function (userSnap) {
                            if (userSnap.exists()) {
                                console.log('tut');
                                LocalStorage.setItem('role', $scope.authAs);
                                if ($scope.authAs === 'users') $state.go('app.user-deliveries');
                                else $state.go('app.admin-deliveries');
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

        $scope.showSimpleToast = function() {
            var pinTo = $scope.getToastPosition();

            $mdToast.show(
                $mdToast.simple()
                    .textContent('Simple Toast!')
                    .position(pinTo )
                    .hideDelay(3000)
            );
        };

        $scope.showActionToast = function() {
            var pinTo = $scope.getToastPosition();
            var toast = $mdToast.simple()
                .textContent('Your account is not confirmed. Send verification email?')
                .action('Send')
                .highlightAction(true)
                .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                .position(pinTo);

            $mdToast.show(toast).then(function(response) {
                if ( response == 'ok' ) {
                    alert('You clicked the \'UNDO\' action.');
                }
            });
        };
    }
})();