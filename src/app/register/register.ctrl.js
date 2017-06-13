(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($scope, toastr, $state, $firebaseAuth, FirebaseRef, LocalStorage) {
        var Auth = $firebaseAuth();
        var storageRef = firebase.storage().ref();
        $scope.registerData = {
            role: 'user'
        };
        $scope.authData = {};
        $scope.upload = false;

        document.getElementById('file').addEventListener('change', function (event) {
            console.log('tut');
            var file = event.target.files[0];
            if (file) {
                $scope.upload = true;
                storageRef.child('/photos/' + file.name).put(file).then(function (snapshot) {
                    console.log('respa');
                    $scope.registerData.photoUrl = snapshot.downloadURL;
                    $scope.upload = false;
                });
            }
        });
    }
})();