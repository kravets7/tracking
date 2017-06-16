(function() {
  'use strict';

    var underscore = angular.module('underscore', []);
    underscore.factory('_', ['$window', function($window) {
        return $window._; // assumes underscore has already been loaded on the page
    }]);

  angular
    .module('sphereLab', ['ui.router', 'firebase', 'ngMaterial', 'ngFileUpload', 'toastr', 'md.data.table', 'underscore']);

})();
