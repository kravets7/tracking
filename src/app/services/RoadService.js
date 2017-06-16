(function () {
    'use strict';

    angular
        .module('sphereLab')
        .service('RoadService', RoadService);

    /** @ngInject */
    function RoadService($http) {
        return {
            getItem: function (rawRoute) {
                var path = '';
                rawRoute.forEach(function (item) {
                    path += item.latitude + ',' + item.longitude + '|';
                });
                path = path.slice(0,-1);
                return $http.get('https://roads.googleapis.com/v1/snapToRoads?path='+path+'&key=AIzaSyBzrrhQPVjUwtEpUAHEhKDhhPrMa-u5Zj8&interpolate=true')
            }
        }
    }
})();