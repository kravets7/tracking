(function () {
    'use strict';

    angular
        .module('sphereLab')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('auth', {
                url: '/',
                views: {
                    'main': {
                        templateUrl: 'app/auth/auth.html',
                        controller: 'AuthController'
                    }
                }
            })
            .state('register', {
                url: '/register',
                views: {
                    'main': {
                        templateUrl: 'app/register/register.html',
                        controller: 'RegisterController'
                    }
                }
            })
            .state('app', {
                abstract: true,
                views   : {
                    'main@': {
                        templateUrl: 'app/main/main.html',
                        controller: 'MainController'
                    }
                }
            })
            .state('app.user.home', {
                url: '/user-home',
                views: {
                    'content@app': {
                        templateUrl: 'app/user-home/user-user-home.html',
                        controller: 'UserHomeController'
                    }
                },
                auth: true
            });

        $urlRouterProvider.otherwise('/');
    }

})();