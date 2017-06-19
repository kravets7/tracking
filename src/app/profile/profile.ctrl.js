(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($scope, LocalStorage, FirebaseAuth, FirebaseRef, StorageRef, toastr, $firebaseObject) {
        $scope.photo = 'assets/icons/user.png';

        FirebaseAuth.onAuthStateChanged(function(user) {
            $scope.uid = user.uid;
            $scope.role = LocalStorage.getItem('role');
            var userRef = FirebaseRef.child($scope.role).child(user.uid);
            $scope.data = $firebaseObject(userRef);
            $scope.data.$loaded().then(function (data) {
                $scope.photo = data.photoUrl;
            });
        });

        $scope.upload = false;

        document.getElementById('file').addEventListener('change', function (event) {
            console.log('tut');
            var file = event.target.files[0];
            if (file) {
                $scope.upload = true;
                StorageRef.child(file.name).put(file).then(function (snapshot) {
                    console.log('respa');
                    $scope.photo = snapshot.downloadURL;
                    $scope.upload = false;
                    FirebaseRef.child($scope.role)
                        .child($scope.uid)
                        .update({photoUrl: $scope.photo}, function (err) {
                            if (err) {
                                console.log(err);
                                toastr.error(err.message, 'Error')
                            } else {
                                $scope.data.photoUrl = $scope.photo;
                            }
                        });
                });
            }
        });
    }
})();