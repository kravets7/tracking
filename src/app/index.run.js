(function () {
    'use strict';

    angular
        .module('sphereLab')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $state, $firebaseAuth) {
        var Auth = $firebaseAuth();
    }
})();
