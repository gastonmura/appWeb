'use strict';

describe('Emoapps E2E Tests:', function () {
  describe('Test Emoapps page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/emoapps');
      expect(element.all(by.repeater('emoapp in emoapps')).count()).toEqual(0);
    });
  });
});
