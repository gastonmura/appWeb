(function () {
  'use strict';

  // Emoapps controller
  angular
    .module('emoapps')
    .controller('EmoappsController', EmoappsController);

  EmoappsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'emoappResolve'];

  function EmoappsController ($scope, $state, $window, Authentication, emoapp) {
    var vm = this;

    vm.authentication = Authentication;
    vm.emoapp = emoapp;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Emoapp
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.emoapp.$remove($state.go('emoapps.list'));
      }
    }

    // Save Emoapp
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.emoappForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.emoapp._id) {
        vm.emoapp.$update(successCallback, errorCallback);
      } else {
        vm.emoapp.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('emoapps.view', {
          emoappId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
