var Dropbox = require('../../src/dropbox');
var fs = require('fs');
var path = require('path');
var prompt = require('prompt');
var express = require('express');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://admin:1234@ds129720.mlab.com:29720/heroku_n1kxz9pj';
var router = express.Router();
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


/* GET home page. */
router.get('/', function(req, res) {
  // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
        if(err){
            return res.json( {success: false, message: err });
        }
		    var data;
        db.collection('powerlines', function(err, collection) 
        {
            collection.find({}).toArray(function(err, results) 
            {
                data = results;
                //console.log(path);
                //res.download(path);
                
            });
        });
    });

    prompt.start();

    prompt.get({
      properties: {
        accessToken: {
          description: 'Please enter an API V2 access token'
        }
      }
    }, function (error, result) {
      var dbx = new Dropbox({ accessToken: result.accessToken });

      

        // This uploads basic.js to the root of your dropbox
        dbx.filesUpload({ path: '/Apps/nodejs/test.json', data: data })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (err) {
            console.log(err);
          });
      });
    });
    module.exports = router;