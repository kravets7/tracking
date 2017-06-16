(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, LocalStorage, $state, FirebaseAuth, FirebaseRef, $timeout, $mdSidenav, $log) {
        $scope.logout = function () {
            LocalStorage.removeItem('role');
            FirebaseAuth.signOut()
                .then(function () {
                    $state.go('auth');
                })
                .catch(function (err) {
                    console.log(err);
                });
        };

        $scope.photo = 'assets/icons/user.png';

        FirebaseAuth.onAuthStateChanged(function(user) {
            var role = LocalStorage.getItem('role');
            $rootScope.id = user.uid;
            FirebaseRef.child(role)
                .child(user.uid)
                .once('value', function (userSnap) {
                    $rootScope.User = userSnap.val();
                    $rootScope.id = user.uid;
                    $scope.photo = userSnap.val().photoUrl;
                })
        });

        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        function buildDelayedToggler(navID) {
            return debounce(function () {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }

        $scope.toggleLeft = buildDelayedToggler('left');
    }
})();