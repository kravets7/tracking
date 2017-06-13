(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, LocalStorage, $state, $firebaseAuth) {
        var Auth = $firebaseAuth();
        $scope.logout = function () {
            LocalStorage.removeItem('role');
            Auth.$unauth();
            $state.go('auth');
        };
    }
})();
