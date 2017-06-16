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
            .state('app.user-deliveries', {
                url: '/user/deliveries',
                views: {
                    'content@app': {
                        templateUrl: 'app/user-deliveries/user-deliveries.html',
                        controller: 'UserDeliveriesController'
                    }
                },
                auth: true
            })
            .state('app.user-tracking', {
                url: '/user/tracking',
                params: {
                    obj: null
                },
                views: {
                    'content@app': {
                        templateUrl: 'app/user-tracking/user-tracking.html',
                        controller: 'UserTrackingController'
                    }
                },
                auth: true
            });

        $urlRouterProvider.otherwise('/');
    }

})();