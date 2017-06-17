(function () {
  'use strict';

  describe('Emoapps List Controller Tests', function () {
    // Initialize global variables
    var EmoappsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      EmoappsService,
      mockEmoapp;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _EmoappsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      EmoappsService = _EmoappsService_;

      // create mock article
      mockEmoapp = new EmoappsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Emoapp Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Emoapps List controller.
      EmoappsListController = $controller('EmoappsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockEmoappList;

      beforeEach(function () {
        mockEmoappList = [mockEmoapp, mockEmoapp];
      });

      it('should send a GET request and return all Emoapps', inject(function (EmoappsService) {
        // Set POST response
        $httpBackend.expectGET('api/emoapps').respond(mockEmoappList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.emoapps.length).toEqual(2);
        expect($scope.vm.emoapps[0]).toEqual(mockEmoapp);
        expect($scope.vm.emoapps[1]).toEqual(mockEmoapp);

      }));
    });
  });
}());
