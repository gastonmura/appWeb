'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Emoapp = mongoose.model('Emoapp'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'), 
  express = require('express'),
  Twitter = require('twitter');

/**
 * Create a Emoapp
 */
exports.create = function(req, res) {
  var emoapp = new Emoapp(req.body);
  emoapp.user = req.user;

  emoapp.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emoapp);
    }
  });
};

/**
 * Show the current Emoapp
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var emoapp = req.emoapp ? req.emoapp.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  emoapp.isCurrentUserOwner = req.user && emoapp.user && emoapp.user._id.toString() === req.user._id.toString();

  res.jsonp(emoapp);
};

/**
 * Update a Emoapp
 */
exports.update = function(req, res) {
  var emoapp = req.emoapp;

  emoapp = _.extend(emoapp, req.body);

  emoapp.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emoapp);
    }
  });
};

/**
 * Delete an Emoapp
 */
exports.delete = function(req, res) {
  var emoapp = req.emoapp;

  emoapp.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emoapp);
    }
  });
};

/**
 * List of Emoapps
 */
exports.list = function(req, res) {
  Emoapp.find().sort('-created').populate('user', 'displayName').exec(function(err, emoapps) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(emoapps);
    }
  });
};

// Funciones agregadas inicio
function guardarBusqueda( objJson ){
  
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost/mean-dev";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;    
    db.collection("listaTweets").insertOne(objJson, function(err, res) {
      if (err) throw err;
      console.log("busqueda guardada");
      db.close();
    });
  });  

}

// funciones g drive
// 125999604641-angupa4a4ormtutn79v3525j1s6oadt9.apps.googleusercontent.com 
// V-TujBufqZ5xwRNbxCJASnhW 
// http://localhost:3000/oauth2callback

// api key para otra forma de autenticar  AIzaSyB0CNU5qp9gpWKodNfdWpgPoQKtqGKmRos 

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var SCOPES = ['https://www.googleapis.com/auth/drive', 
              'https://www.googleapis.com/auth/drive.file', 
              'https://www.googleapis.com/auth/drive.appdata'];

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

// Load client secrets from a local file.
/*fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Drive API.
  authorize(JSON.parse(content), subirImagenes);
});*/

function authorize() {
  
  var data = fs.readFileSync('client_secret.json');
  var credentials = JSON.parse(data);

  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  var token = fs.readFileSync(TOKEN_PATH);
  oauth2Client.credentials = JSON.parse(token);

  return oauth2Client;
}


/*function authorize(credentials, callback) {
  
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      console.log(err);
      //getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });

}*/

function procesarImagenes(archivo){

  /*const http = require('http');
  const fileType = require('file-type');
  const url = archivo;

  http.get(url, res => {
      res.once('data', chunk => {
          res.destroy();
          var ftipo = fileType(chunk);
          //=> {ext: 'gif', mime: 'image/gif'} 
          console.log("Procesando ... url:"+url+" ext:"+ftipo.ext+" mime:"+ftipo.mime);
          subirImagenes(url, ftipo.ext, ftipo.mime);
      });
  });*/

  var nombreImgUp =  require('crypto').createHash('md5').update(archivo).digest('hex')+'.tmp';
  
  const readChunk = require('read-chunk');
  const fileType = require('file-type');
  const buffer = readChunk.sync("public/tmp/"+nombreImgUp, 0, 4100);
   
  var tipo = fileType(buffer);
  console.log(tipo);


}

function subirImagenes(imagen, ext, mime){

  var auth = authorize();

  var drive = google.drive({
    version: 'v3',
    auth: auth
  });
  
  console.log("Nombre imagen: "+imagen);
  var nombreImgUp =  require('crypto').createHash('md5').update(imagen).digest('hex')+'.tmp';
  console.log("Nombre imagen local: "+nombreImgUp);

  var folderId = '0B9jDZpLlxDeGZ0xobHNrWGZabWc';
  var fileMetadata = {
    'name': nombreImgUp+'.'+ext,
    parents: [ folderId ]
  };
  var media = {
    mimeType: mime,
    body: fs.createReadStream("public/tmp/"+nombreImgUp)
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

}

// Funciones agregadas fin

exports.obtenerTweets = function(req, res) {

  console.log("//********* INICIO NUEVA CONSULTA TWEET ***********//");
  
  var latitud = req.params.lat; //-43.253333;  
  var longitud = req.params.long; //-65.309444;
  var radio = "10km";
  var nTweets = 50;
  var imgSave = 10;

  var client = new Twitter({
    consumer_key: 'XEpmSeeUEHkNgga7MN68vFnC1',
    consumer_secret: 'L2XpT8xpmiP9Ia6ySh101YfW0as4Xz33jERfy1ISvgoirPSRGt',
    access_token_key: '184062783-ZmmgxBXQLpNQS0Fhgi8w5N4P2HsbgzBUY6ZRQvqd',
    access_token_secret: 'Zkm7fDY2MXBYGCGMKFgD7pWQvOaeI3RoGboR8hIS217fa',
    app_only_auth: true
  });

  client.get('search/tweets', { q: '*', geocode:latitud+','+longitud+','+radio, count:nTweets, exclude_replies:true, include_rts:false }, function(error, tweets, response) {
    
    if (!error) {
      
      //console.dir(tweets.statuses);
      //console.log(response);

      //var sentiment = require('sentiment-multilang');
      var sentiment = require('sentiment');
      var tws = tweets.statuses;
      
      var listaTweets = [];
      var terminosResumen = [];
      var imagenes = [];
      var twPos = 0;
      var twNeg = 0;  
      var twNeu = 0;
      var imgSalvadas = 0;

            
      function subirDrive(url){
           
            // abro imagen
            var http = require('http'),                                                
                Stream = require('stream').Transform,                                  
                fs = require('fs');                                                    
  
          http.request(url, function(response) {                                        
              
              var data = new Stream();                                                    

              response.on('data', function(chunk) {                                       
                data.push(chunk);                                                         
              });                                                                         

              response.on('end', function() {                                             
                
                var imgRecu =  data.read();

                //procesarImagenes(imagenTmp);
                /* saco tipo y mime */
                //const readChunk = require('read-chunk');
                const fileType = require('file-type');
                const buffer = imgRecu; //readChunk.sync("public/tmp/"+nombreImgUp, 0, 4100);
                 
                var tipo = fileType(buffer);
                console.log(tipo);
                
                /* subo al drive */
                var auth = authorize();

                var drive = google.drive({
                  version: 'v3',
                  auth: auth
                });
                
                //console.log("Nombre imagen: "+imagen);
                var nombreImgUp =  require('crypto').createHash('md5').update(url).digest('hex');
                //console.log("Nombre imagen local: "+nombreImgUp);

                var folderId = '0B9jDZpLlxDeGZ0xobHNrWGZabWc';
                
                var fileMetadata = {
                  'name': nombreImgUp+'.'+tipo.ext,
                  parents: [ folderId ]
                };
                
                var media = {
                  mimeType: tipo.mime,
                  body: imgRecu //fs.createReadStream("public/tmp/"+nombreImgUp)
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
                /* fin subo al drive */

              
              });                                                                         
            
            }).end();
      }
      
      // recorro los tweets
      for (var i = 0; i < tws.length; i++) {
        
        // EMOCIONES evaluamos emocion
        //var r1 = sentiment(tws[i].text,'es');
        var r1 = sentiment(tws[i].text);
        //console.dir(tws[i].text);
        //console.dir(r1);
        
        // TERMINOS RESUMEN
        terminosResumen = terminosResumen.concat(r1.words); 
      
        // POSITIVO NEGATIVO NEUTRO
        var vote = "";          
          // POSITIVO
          if(r1.score > 0){
            vote = "Positivo";
            twPos++;
          }else{
            // NEGATIVO
            if(r1.score < 0){
              vote = "Negativo";
              twNeg++;
            }else{
              // NEUTRO
              vote = "Neutro";
              twNeu++;
            }    
          }

        /*
        var vote = r1.vote;
        switch(r1.vote){
          case 'positive':
            twPos++;
          break;
          case 'negative':
            twNeg++;
          break;
          case 'neutro':
            twNeu++;
          break;
        }*/

        // IMAGENES solo si existe media photo
        var media_url = [];
        // si existe obj media
        if( tws[i].entities.hasOwnProperty('media') ){
          
          // recorro el arreglo de objetos media
          for (var j = 0; j < tws[i].entities.media.length; j++) {
            // si es una imagen la guardo 
            if( tws[i].entities.media[j].type === "photo" ){
              media_url.push(tws[i].entities.media[j].media_url);
            }

            // me fijo si a esa imagen la guardo o no y si ya llegue al limite que guardo
            if( ( Math.round(Math.random()*100) >= 50 ) && ( imgSalvadas < imgSave ) ){
              
              // la guardo
              imagenes.push({"idTweet":tws[i].id_str, "img":tws[i].entities.media[j].media_url, "twEstado":vote});
              
              // imagen que voy a bajar
              var imagenDrive = tws[i].entities.media[j].media_url; 
              console.log( "Imagen que voy a bajar: " + imagenDrive );
              // nombre local con la cual la guardo
              //var nombreImgUp =  require('crypto').createHash('md5').update(imagenTmp).digest('hex')+'.tmp';
              //console.log( "Imagen local: " + nombreImgUp );
              
              subirDrive(imagenDrive);


              // bajo la imagen
              //const download = require('image-downloader');
              //const options = {
              //  url: imagenTmp,
              //  dest: 'public/tmp/'+nombreImgUp              
              // };
               
              //download.image(options)
              //  .then(({ filename, image }) => {
              //    console.log('Imagen salvada', imagenTmp);
              //  }).catch((err) => {
              //    throw err;
              //  });

              imgSalvadas++;
            }

          }  
        }

        // TWEET guardo lo que me interesa del twwet
        var TweetAux = {
                          "idTweet":tws[i].id_str,
                          "created_at":tws[i].created_at,
                          "name": tws[i].user.name,
                          "screen_name": tws[i].user.screen_name,
                          "location":tws[i].user.location,
                          "text":tws[i].text,
                          "twEstado":vote,
                          "score":r1.score,
                          "comparative":r1.comparative,
                          "words": r1.words,
                          "positive": r1.positive,
                          "negative": r1.negative,  
                          "perfil_img":tws[i].user.profile_image_url,
                          "media_url": media_url
                        };
        listaTweets.push(TweetAux);
      }


     // si hay imagenes las subo a google drive
     for (var k = 0; k < imagenes.length; k++) {
        //procesarImagenes(imagenes[k].img);
      } 

     var objTweet = { 
                       "longitud": longitud,
                       "latitud": latitud,
                       "radio": radio,
                       "lugar": "resolver con google",
                       "nTweets": nTweets,
                       "tweetsPositivos": twPos,
                       "tweetsNegativos": twNeg,
                       "tweetsNeutros": twNeu,
                       "terminosResumen": terminosResumen,
                       "imagenes":imagenes,
                       "listaTweets":listaTweets
                      };                        
    
    /*
    var objTweet = { 
                       "longitud": longitud,
                       "latitud": latitud,
                       "radio": radio,
                       "lugar": "resolver con google",
                       "nTweets": nTweets,
                       "tweetsPositivos": 1,
                       "tweetsNegativos": 1,
                       "tweetsNeutros": 1,
                       "terminosResumen": ["a","abd","tergs"],
                       "imagenes":[
                                    {"idTweet":1, "img":"asasfdad.jpg", "twEstado":"Positivo|Negativo|Neutro"},
                                    {"idTweet":1, "img":"asasfdad.jpg", "twEstado":"Positivo|Negativo|Neutro"}
                                  ],
                        "listaTweets":[
                                        {
                                          "idTweet":1,
                                          "created_at":"06/05/2017 11:02:58",
                                          "screen_name": "gaston mura",
                                          "location":"trelew",
                                          "text":"Ssdfsds dfsdf sdg f hsd hs",
                                          "twEstado":"Neutro",  
                                          "perfil_img":"http://asasfsfa/asasd.jpg",
                                          "media_url":["http://asasfsfa/iamgenes_asd.jpg","..."]
                                        }
                                      ]
                      }                        
    */
      //console.log(objTweet);
      guardarBusqueda( objTweet );
      return res.jsonp(objTweet);
      //return res.jsonp(tweets);
      
    }else{
      console.log(error);
      return res.jsonp(error);
    }
  });

};


/**
 * Emoapp middleware
 */
exports.emoappByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Emoapp is invalid'
    });
  }

  Emoapp.findById(id).populate('user', 'displayName').exec(function (err, emoapp) {
    if (err) {
      return next(err);
    } else if (!emoapp) {
      return res.status(404).send({
        message: 'No Emoapp with that identifier has been found'
      });
    }
    req.emoapp = emoapp;
    next();
  });
};
