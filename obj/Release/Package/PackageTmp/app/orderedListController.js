(function () {
    'use strict';
    var controllerId = 'orderedListController';
    angular.module('orderedListApp')
        .controller(controllerId, ['orderedListService', '$cookies', '$scope', orderedListController]);

    function orderedListController(orderedListService, $cookies, $scope) {
        var vm = this;
        vm.loading = false;
        vm.orderedList = [];
        vm.orderedListService = orderedListService;
        vm.possiblePositions = [];
        activate();

        vm.saveOrderedList = function () {
            vm.orderedListService.UpdateOrderedListItems(vm.clientReferenceId, vm.orderedList);
            toastr.success('Saved.');
        }

        // Adds an item to the list
        vm.addItem = function (name) {
            if (!name) toastr.warning('Item requires a name.');
            else {
                vm.orderedList.push(
                    {
                        Position: vm.orderedList.length + 1,
                        Name: name
                    });
                vm.possiblePositions.push(vm.possiblePositions.length + 1);
                vm.newName = null;
                vm.saveOrderedList();
            }
        }

        // Removes an item from the list
        vm.removeItem = function (item) {
            var index = vm.orderedList.indexOf(item);
            vm.orderedList.splice(index, 1);

            for (var i = index; i < vm.orderedList.length; i++) {
                vm.orderedList[i].Position--;
            }
            vm.possiblePositions.pop();
            vm.saveOrderedList();
        }

        // Reorders items, configures Positions
        vm.reOrderItems = function (item) {
            if (item.Position) {
                var index = vm.orderedList.indexOf(item);
                vm.orderedList.splice(index, 1);

                // Setting the position within the proper bounds
                if (item.Position < 1) item.Position = 1;
                else if (item.Position > vm.orderedList.length + 1) item.Position = vm.orderedList.length + 1;
                vm.orderedList.splice(item.Position - 1, 0, item);
            }
            
            reIndex();
            vm.saveOrderedList();
        }

        function activate() {
            if ($cookies.get('clientReferenceId')) {
                vm.clientReferenceId = $cookies.get('clientReferenceId').replace(/['"]+/g, '');
            }
            loadInitialList();
        }

        function reIndex() {

            for (var i = 0; i < vm.orderedList.length; i++) {
                vm.orderedList[i].Position = i + 1;
            }
        }

        function initializePossiblePositions() {
            for (var i = 0; i < vm.orderedList.length; i++) vm.possiblePositions.push(i + 1);
        }

        function loadInitialList() {
            if (vm.clientReferenceId) {

                // If we have a clientReferenceId for this client, get this client's 
                // OrderedList from the API

                vm.loading = true;
                orderedListService.GetOrderedListItems(vm.clientReferenceId).then(function (response) {
                    vm.orderedList = response.data;

                    initializePossiblePositions();

                    vm.loading = false;
                    toastr.success('List data loaded.');

                }, function (data) {
                    vm.loading = false;
                    toastr.error('We have a clientReferenceId, but couldn\'t retrieve the Ordered List.\n' + data.data.Message);
                });

            } else {

                // Otherwise create a new clientReferenceId for this client and store

                orderedListService.CreateOrderedListItems().then(function (response) {
                    vm.clientReferenceId = response.data;
                    $cookies.put('clientReferenceId', vm.clientReferenceId);
                    toastr.success('New list initialized.');
                }, function (data) {
                    toastr.error('We are having trouble initializing the Ordered List.\n' + data.data.Message);
                });
            }
        }
    }
})();