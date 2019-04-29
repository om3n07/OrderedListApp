(function () {
    'use strict';
    var serviceId = 'orderedListService';
    angular.module('orderedListApp').factory(serviceId, ['$http', orderedListService]);

    function orderedListService($http) {
        var serviceBase = "http://orderedlistapi.azurewebsites.net/api/";
        
        var getOrderedListItems = function (listId) {
            var serviceAddress = serviceBase + "OrderedListItems/" +listId;
            return $http.get(serviceAddress);
        }

        var updateOrderedListItems = function (listId, orderedListItems) {
            var serviceAddress = serviceBase + "OrderedListItems/" + listId;
            return $http.put(serviceAddress, orderedListItems);
        }

        var createOrderedListItems = function (orderedListItems) {
            var serviceAddress = serviceBase + "OrderedListItems";
            return $http.post(serviceAddress);
        }

        var service = {
            GetOrderedListItems: getOrderedListItems,
            UpdateOrderedListItems: updateOrderedListItems,
            CreateOrderedListItems: createOrderedListItems
        };

        return service;
    }
})();