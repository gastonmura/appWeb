(function () {
  'use strict';

  angular
    .module('emoapps')
    .controller('EmoappsListController', EmoappsListController);

  EmoappsListController.$inject = ['EmoappsService'];

  function EmoappsListController(EmoappsService) {
    var vm = this;

    vm.emoapps = EmoappsService.query();
  }
}());
