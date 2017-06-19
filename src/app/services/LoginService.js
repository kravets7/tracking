(function () {
    'use strict';

    angular
        .module('sphereLab')
        .service('LoginService', LoginService);

    /** @ngInject */
    function LoginService(LocalStorage, $firebaseAuth) {
        var Auth = $firebaseAuth();
        return {
            login: function () {
                var email = LocalStorage.getItem('email');
                var password = LocalStorage.getItem('password');
                Auth.$signInWithEmailAndPassword(email, password);
            },
            setItem: function (email, password) {
                LocalStorage.setItem('email', email);
                LocalStorage.setItem('password', password);
            }
        }
    }
})();