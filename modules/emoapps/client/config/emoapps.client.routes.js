(function () {
  'use strict';

  angular
    .module('emoapps')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('emoapps', {
        abstract: true,
        url: '/emoapps',
        template: '<ui-view/>'
      })
      .state('emoapps.map', {
        url: '/map',
        templateUrl: 'modules/emoapps/client/views/map-emoapps.client.view.html',
        controller: 'EmoappsMapController',
        controllerAs: 'vm',
        data: {}
      })
      .state('emoapps.list', {
        url: '',
        templateUrl: 'modules/emoapps/client/views/list-emoapps.client.view.html',
        controller: 'EmoappsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Emoapps List'
        }
      })
      .state('emoapps.create', {
        url: '/create',
        templateUrl: 'modules/emoapps/client/views/form-emoapp.client.view.html',
        controller: 'EmoappsController',
        controllerAs: 'vm',
        resolve: {
          emoappResolve: newEmoapp
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Emoapps Create'
        }
      })
      .state('emoapps.edit', {
        url: '/:emoappId/edit',
        templateUrl: 'modules/emoapps/client/views/form-emoapp.client.view.html',
        controller: 'EmoappsController',
        controllerAs: 'vm',
        resolve: {
          emoappResolve: getEmoapp
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Emoapp {{ emoappResolve.name }}'
        }
      })
      .state('emoapps.view', {
        url: '/:emoappId',
        templateUrl: 'modules/emoapps/client/views/view-emoapp.client.view.html',
        controller: 'EmoappsController',
        controllerAs: 'vm',
        resolve: {
          emoappResolve: getEmoapp
        },
        data: {
          pageTitle: 'Emoapp {{ emoappResolve.name }}'
        }
      })
      ;
  }

  getEmoapp.$inject = ['$stateParams', 'EmoappsService'];

  function getEmoapp($stateParams, EmoappsService) {
    return EmoappsService.get({
      emoappId: $stateParams.emoappId
    }).$promise;
  }

  newEmoapp.$inject = ['EmoappsService'];

  function newEmoapp(EmoappsService) {
    return new EmoappsService();
  }
}());
