// Copyright 2012-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var OAuth2Client = google.auth.OAuth2;
//var plus = google.plus('v1');

// Client ID and client secret are available at
// https://code.google.com/apis/console
//var CLIENT_ID = 'YOUR CLIENT ID HERE';
//var CLIENT_SECRET = 'YOUR CLIENT SECRET HERE';
//var REDIRECT_URL = 'YOUR REDIRECT URL HERE';

//var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);


var oauth2Client = new OAuth2Client(
  '125999604641-angupa4a4ormtutn79v3525j1s6oadt9.apps.googleusercontent.com',
  'V-TujBufqZ5xwRNbxCJASnhW',
  'http://localhost:3000/oauth2callback'
);

var drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

var scopes = ['https://www.googleapis.com/auth/drive', 
              'https://www.googleapis.com/auth/drive.file', 
              'https://www.googleapis.com/auth/drive.appdata'];


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/*
var app = express();

app.get('/oauth2callback', function(req, res) {
  var code = req.query.code;
  console.log(code);
  // request access token
  oauth2Client.getToken(code, function (err, tokens) {
    if (err) {
      console.log(err);
      return false;
    }
    oauth2Client.setCredentials(tokens);
    return true;
  });
});*/

function getAccessToken (oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: scopes //'https://www.googleapis.com/auth/plus.me' // can be a space-delimited string or an array of scopes
  });

  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function (code) {
    // request access token
    oauth2Client.getToken(code, function (err, tokens) {
      if (err) {
        return callback(err);
      }
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.setCredentials(tokens);
      callback();
    });
  });
}

// retrieve an access token
getAccessToken(oauth2Client, function () {

  var folderId = '0B9jDZpLlxDeGZ0xobHNrWGZabWc';
  var fileMetadata = {
    'name': 'lafoto.jpg',
    parents: [ folderId ]
  };
  var media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('modules/emoapps/client/img/lafoto.jpg')
  };
  drive.files.create({
     resource: fileMetadata,
     media: media,
     fields: 'id'
  }, function(err, file) {
    if(err) {
      // Handle error
      console.log(err);
    } else {
      console.log('File Id: ', file.id);
    }
  });


  // retrieve user profile
  console.log("callback console log");

  return true;
});