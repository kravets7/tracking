(function () {
    'use strict';

    angular
        .module('sphereLab')
        .service('NotificationService', NotificationService);

    /** @ngInject */
    function NotificationService(FirebaseRef) {
        return {
            setNewItem: function (item) {
                var data = {
                    date: Date.now(),
                    deliveryId: item.id,
                    recipientId: item.recipientId,
                    status: item.newStatus || item.status
                };
                FirebaseRef.child('messages')
                    .push(data);
            }
        }
    }
})();