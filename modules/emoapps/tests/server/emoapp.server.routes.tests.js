'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Emoapp = mongoose.model('Emoapp'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  emoapp;

/**
 * Emoapp routes tests
 */
describe('Emoapp CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Emoapp
    user.save(function () {
      emoapp = {
        name: 'Emoapp name'
      };

      done();
    });
  });

  it('should be able to save a Emoapp if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Emoapp
        agent.post('/api/emoapps')
          .send(emoapp)
          .expect(200)
          .end(function (emoappSaveErr, emoappSaveRes) {
            // Handle Emoapp save error
            if (emoappSaveErr) {
              return done(emoappSaveErr);
            }

            // Get a list of Emoapps
            agent.get('/api/emoapps')
              .end(function (emoappsGetErr, emoappsGetRes) {
                // Handle Emoapps save error
                if (emoappsGetErr) {
                  return done(emoappsGetErr);
                }

                // Get Emoapps list
                var emoapps = emoappsGetRes.body;

                // Set assertions
                (emoapps[0].user._id).should.equal(userId);
                (emoapps[0].name).should.match('Emoapp name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Emoapp if not logged in', function (done) {
    agent.post('/api/emoapps')
      .send(emoapp)
      .expect(403)
      .end(function (emoappSaveErr, emoappSaveRes) {
        // Call the assertion callback
        done(emoappSaveErr);
      });
  });

  it('should not be able to save an Emoapp if no name is provided', function (done) {
    // Invalidate name field
    emoapp.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Emoapp
        agent.post('/api/emoapps')
          .send(emoapp)
          .expect(400)
          .end(function (emoappSaveErr, emoappSaveRes) {
            // Set message assertion
            (emoappSaveRes.body.message).should.match('Please fill Emoapp name');

            // Handle Emoapp save error
            done(emoappSaveErr);
          });
      });
  });

  it('should be able to update an Emoapp if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Emoapp
        agent.post('/api/emoapps')
          .send(emoapp)
          .expect(200)
          .end(function (emoappSaveErr, emoappSaveRes) {
            // Handle Emoapp save error
            if (emoappSaveErr) {
              return done(emoappSaveErr);
            }

            // Update Emoapp name
            emoapp.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Emoapp
            agent.put('/api/emoapps/' + emoappSaveRes.body._id)
              .send(emoapp)
              .expect(200)
              .end(function (emoappUpdateErr, emoappUpdateRes) {
                // Handle Emoapp update error
                if (emoappUpdateErr) {
                  return done(emoappUpdateErr);
                }

                // Set assertions
                (emoappUpdateRes.body._id).should.equal(emoappSaveRes.body._id);
                (emoappUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Emoapps if not signed in', function (done) {
    // Create new Emoapp model instance
    var emoappObj = new Emoapp(emoapp);

    // Save the emoapp
    emoappObj.save(function () {
      // Request Emoapps
      request(app).get('/api/emoapps')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Emoapp if not signed in', function (done) {
    // Create new Emoapp model instance
    var emoappObj = new Emoapp(emoapp);

    // Save the Emoapp
    emoappObj.save(function () {
      request(app).get('/api/emoapps/' + emoappObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', emoapp.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Emoapp with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/emoapps/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Emoapp is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Emoapp which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Emoapp
    request(app).get('/api/emoapps/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Emoapp with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Emoapp if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Emoapp
        agent.post('/api/emoapps')
          .send(emoapp)
          .expect(200)
          .end(function (emoappSaveErr, emoappSaveRes) {
            // Handle Emoapp save error
            if (emoappSaveErr) {
              return done(emoappSaveErr);
            }

            // Delete an existing Emoapp
            agent.delete('/api/emoapps/' + emoappSaveRes.body._id)
              .send(emoapp)
              .expect(200)
              .end(function (emoappDeleteErr, emoappDeleteRes) {
                // Handle emoapp error error
                if (emoappDeleteErr) {
                  return done(emoappDeleteErr);
                }

                // Set assertions
                (emoappDeleteRes.body._id).should.equal(emoappSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Emoapp if not signed in', function (done) {
    // Set Emoapp user
    emoapp.user = user;

    // Create new Emoapp model instance
    var emoappObj = new Emoapp(emoapp);

    // Save the Emoapp
    emoappObj.save(function () {
      // Try deleting Emoapp
      request(app).delete('/api/emoapps/' + emoappObj._id)
        .expect(403)
        .end(function (emoappDeleteErr, emoappDeleteRes) {
          // Set message assertion
          (emoappDeleteRes.body.message).should.match('User is not authorized');

          // Handle Emoapp error error
          done(emoappDeleteErr);
        });

    });
  });

  it('should be able to get a single Emoapp that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Emoapp
          agent.post('/api/emoapps')
            .send(emoapp)
            .expect(200)
            .end(function (emoappSaveErr, emoappSaveRes) {
              // Handle Emoapp save error
              if (emoappSaveErr) {
                return done(emoappSaveErr);
              }

              // Set assertions on new Emoapp
              (emoappSaveRes.body.name).should.equal(emoapp.name);
              should.exist(emoappSaveRes.body.user);
              should.equal(emoappSaveRes.body.user._id, orphanId);

              // force the Emoapp to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Emoapp
                    agent.get('/api/emoapps/' + emoappSaveRes.body._id)
                      .expect(200)
                      .end(function (emoappInfoErr, emoappInfoRes) {
                        // Handle Emoapp error
                        if (emoappInfoErr) {
                          return done(emoappInfoErr);
                        }

                        // Set assertions
                        (emoappInfoRes.body._id).should.equal(emoappSaveRes.body._id);
                        (emoappInfoRes.body.name).should.equal(emoapp.name);
                        should.equal(emoappInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Emoapp.remove().exec(done);
    });
  });
});
