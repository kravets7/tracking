(function () {
    'use strict';

    angular
        .module('sphereLab')
        .service('LocalStorage', LocalStorage);

    /** @ngInject */
    function LocalStorage() {
        return {
            getItem: function (key) {
                return JSON.parse(localStorage.getItem(key));
            },
            setItem: function (key, data) {
                localStorage.setItem(key, JSON.stringify(data));
            },
            removeItem: function (key) {
                localStorage.removeItem(key);
            },
            clearStorage: function () {
                localStorage.clear();
            }
        }
    }
})();