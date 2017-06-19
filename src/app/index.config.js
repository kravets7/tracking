(function () {
    'use strict';

    angular
        .module('sphereLab')
        .config(config);

    /** @ngInject */
    function config($logProvider, toastrConfig, $mdThemingProvider) {
        // Enable log
        $logProvider.debugEnabled(true);
        console.log(toastrConfig);
        // Set options third-party lib
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.maxOpened = 1000000000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = true;
        toastrConfig.preventOpenDuplicates = true;
        toastrConfig.progressBar = true;

        $mdThemingProvider
            .theme('default')
            .primaryPalette('orange')
            .warnPalette('red');
    }

})();
