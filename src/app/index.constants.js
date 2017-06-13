/* global malarkey:false, moment:false */
(function() {
  'use strict';
    angular
    .module('sphereLab')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('FirebaseRef', firebase.database().ref());

})();
