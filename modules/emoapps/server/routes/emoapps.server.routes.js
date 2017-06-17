'use strict';

/**
 * Module dependencies
 */
var emoappsPolicy = require('../policies/emoapps.server.policy'),
  emoapps = require('../controllers/emoapps.server.controller');

module.exports = function(app) {
  // Emoapps Routes
  app.route('/api/emoapps').all(emoappsPolicy.isAllowed)
    .get(emoapps.list)
    .post(emoapps.create);

  app.route('/api/emoapps/:emoappId').all(emoappsPolicy.isAllowed)
    .get(emoapps.read)
    .put(emoapps.update)
    .delete(emoapps.delete);


  app.route('/api/obtenerTweets/:lat/:long').all()
    .get(emoapps.obtenerTweets);  

  // Finish by binding the Emoapp middleware
  app.param('emoappId', emoapps.emoappByID);

};


// google api  AIzaSyCoNBK_GEpbEah5XxtQaNHxDmHmMRjYENM 