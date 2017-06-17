(function () {
  'use strict';

  describe('Emoapps Route Tests', function () {
    // Initialize global variables
    var $scope,
      EmoappsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _EmoappsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      EmoappsService = _EmoappsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('emoapps');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/emoapps');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          EmoappsController,
          mockEmoapp;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('emoapps.view');
          $templateCache.put('modules/emoapps/client/views/view-emoapp.client.view.html', '');

          // create mock Emoapp
          mockEmoapp = new EmoappsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Emoapp Name'
          });

          // Initialize Controller
          EmoappsController = $controller('EmoappsController as vm', {
            $scope: $scope,
            emoappResolve: mockEmoapp
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:emoappId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.emoappResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            emoappId: 1
          })).toEqual('/emoapps/1');
        }));

        it('should attach an Emoapp to the controller scope', function () {
          expect($scope.vm.emoapp._id).toBe(mockEmoapp._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/emoapps/client/views/view-emoapp.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          EmoappsController,
          mockEmoapp;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('emoapps.create');
          $templateCache.put('modules/emoapps/client/views/form-emoapp.client.view.html', '');

          // create mock Emoapp
          mockEmoapp = new EmoappsService();

          // Initialize Controller
          EmoappsController = $controller('EmoappsController as vm', {
            $scope: $scope,
            emoappResolve: mockEmoapp
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.emoappResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/emoapps/create');
        }));

        it('should attach an Emoapp to the controller scope', function () {
          expect($scope.vm.emoapp._id).toBe(mockEmoapp._id);
          expect($scope.vm.emoapp._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/emoapps/client/views/form-emoapp.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          EmoappsController,
          mockEmoapp;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('emoapps.edit');
          $templateCache.put('modules/emoapps/client/views/form-emoapp.client.view.html', '');

          // create mock Emoapp
          mockEmoapp = new EmoappsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Emoapp Name'
          });

          // Initialize Controller
          EmoappsController = $controller('EmoappsController as vm', {
            $scope: $scope,
            emoappResolve: mockEmoapp
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:emoappId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.emoappResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            emoappId: 1
          })).toEqual('/emoapps/1/edit');
        }));

        it('should attach an Emoapp to the controller scope', function () {
          expect($scope.vm.emoapp._id).toBe(mockEmoapp._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/emoapps/client/views/form-emoapp.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
