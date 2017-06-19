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
            .state('nextRegisterStep', {
                url: '/next',
                params: {
                    data: null
                },
                views: {
                    'main': {
                        templateUrl: 'app/nextRegisterStep/next.html',
                        controller: 'NextController'
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
            .state('app.profile', {
                url: '/profile',
                views: {
                    'content@app': {
                        templateUrl: 'app/profile/profile.html',
                        controller: 'ProfileController'
                    },
                    'nav@app': {
                        templateUrl: 'app/nav/nav.html'
                    }
                },
                auth: true
            })
            .state('app.user-deliveries', {
                url: '/user/deliveries',
                views: {
                    'content@app': {
                        templateUrl: 'app/user-deliveries/user-deliveries.html',
                        controller: 'UserDeliveriesController'
                    },
                    'nav@app': {
                        templateUrl: 'app/nav/nav.html'
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
                    },
                    'nav@app': {
                        templateUrl: 'app/nav/nav.html'
                    }
                },
                auth: true
            })
            .state('app.admin-deliveries', {
                url: '/admin/deliveries',
                views: {
                    'content@app': {
                        templateUrl: 'app/admin-deliveries/admin-deliveries.html',
                        controller: 'AdminDeliveriesController'
                    },
                    'nav@app': {
                        templateUrl: 'app/nav/nav-admin.html'
                    }
                },
                auth: true
            })
            .state('app.admin-tracking', {
                url: '/admin/tracking',
                params: {
                    obj: null
                },
                views: {
                    'content@app': {
                        templateUrl: 'app/admin-tracking/admin-tracking.html',
                        controller: 'AdminTrackingController'
                    },
                    'nav@app': {
                        templateUrl: 'app/nav/nav-admin.html'
                    }
                },
                auth: true
            })
            .state('app.admin-drivers', {
                url: '/admin/drivers',
                views: {
                    'content@app': {
                        templateUrl: 'app/admin-drivers/admin-drivers.html',
                        controller: 'AdminDriversController'
                    },
                    'nav@app': {
                        templateUrl: 'app/nav/nav-admin.html'
                    }
                },
                auth: true
            })
            .state('app.admin-users', {
                url: '/admin/users',
                views: {
                    'content@app': {
                        templateUrl: 'app/admin-users/admin-users.html',
                        controller: 'AdminUsersController'
                    },
                    'nav@app': {
                        templateUrl: 'app/nav/nav-admin.html'
                    }
                },
                auth: true
            })
            .state('app.admin-admins', {
                url: '/admin/admins',
                views: {
                    'content@app': {
                        templateUrl: 'app/admin-admins/admin-admins.html',
                        controller: 'AdminAdminsController'
                    },
                    'nav@app': {
                        templateUrl: 'app/nav/nav-admin.html'
                    }
                },
                auth: true
            })
            .state('app.admin-user-deliveries', {
                url: '/admin/user/deliveries',
                views: {
                    'content@app': {
                        templateUrl: 'app/admin-user-deliveries/admin-user-deliveries.html',
                        controller: 'AdminUserDeliveriesController'
                    },
                    'nav@app': {
                        templateUrl: 'app/nav/nav-admin.html'
                    }
                },
                params: {
                    data: null
                },
                auth: true
            });

        $urlRouterProvider.otherwise('/');
    }

})();