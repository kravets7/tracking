(function () {
    'use strict';

    angular
        .module('sphereLab')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, LocalStorage) {

        $rootScope.$on('$stateChangeStart', function (event, stateData, toParams, fromState) {

            if (stateData.name === 'app.profile') {
                var role = LocalStorage.getItem('role');
                console.log(role);
                if (role && role === 'admins') {
                    stateData.views['nav@app'].templateUrl = 'app/nav/nav-admin.html';
                }
            }
        });

    }
})();
