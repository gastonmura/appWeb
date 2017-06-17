// Emoapps service used to communicate Emoapps REST endpoints
(function () {
  'use strict';

  angular
    .module('emoapps')
    .factory('EmoappsService', EmoappsService);

  EmoappsService.$inject = ['$resource'];

  function EmoappsService($resource) {
    return $resource('api/emoapps/:emoappId', {
      emoappId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
