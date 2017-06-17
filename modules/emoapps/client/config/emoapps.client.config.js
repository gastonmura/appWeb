(function () {
  'use strict';

  angular
    .module('emoapps')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Emoapps',
      state: 'emoapps',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'emoapps', {
      title: 'List Emoapps',
      state: 'emoapps.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'emoapps', {
      title: 'Create Emoapp',
      state: 'emoapps.create',
      roles: ['user']
    });
  }
}());
