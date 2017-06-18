(function() {
    'use strict';

    angular
        .module('sphereLab')
        .controller('ProfileController', ProfileController);

    /** @ngInject */
    function ProfileController($scope, LocalStorage, $state, FirebaseAuth, FirebaseRef, StorageRef, toastr) {
        $scope.photo = 'assets/icons/user.png';

        FirebaseAuth.onAuthStateChanged(function(user) {
            $scope.uid = user.uid;
            console.log(LocalStorage.getItem('role'));
            $scope.role = LocalStorage.getItem('role');
            FirebaseRef.child($scope.role)
                .child(user.uid)
                .once('value', function (userSnap) {
                    console.log(userSnap.val());
                    $scope.photo = userSnap.val().photoUrl;
                    $scope.data = userSnap.val();
                })
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