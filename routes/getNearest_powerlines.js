var Dropbox = require('../../src/dropbox');
var fs = require('fs');
var path = require('path');
var prompt = require('prompt');
var express = require('express');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://admin:1234@ds129720.mlab.com:29720/heroku_n1kxz9pj';
var fs = require('fs');
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

		node_dropbox.Authenticate('os6d36r922c1xbv', 'w5t5w06m409xrl5', function(err, url){
			// redirect user to the url.
			// looks like this: "https://www.dropbox.com/1/oauth2/authorize?client_id=<key_here>&response_type=code&redirect_uri=<redirect_url_here>"
            //https://www.dropbox.com/1/oauth2/authorize?client_id=<os6d36r922c1xbv>&response_type=code&redirect_uri=<https://nampowermobilegis.herokuapp.com/getNearest_powerlines>
		});
		node_dropbox.AccessToken('os6d36r922c1xbv', 'w5t5w06m409xrl5', function(err, body) {
			access_token = body.access_token;
		});

		api = node_dropbox.api(access_token);
		api.account(function(err, res, body) {
			console.log(body);
		});
		var path = '/Apps/nodejs/test.json'
		api.account(callback); // Fetches the account information.
		//api.createDir(path, callback); // Creates a directory.
		//api.removeDir(path, callback); // Deletes a directory.
		api.createFile(path, data, callback); // Creates a new file.
		//api.removeFile(path, callback) // Deletes a file.
		//api.moveSomething(from_path, to_path, callback); // Moves/renames a file.
		//api.getMetadata(path, callback) // Retrieves file and folder metadata. Can be used to list a folder's content.
		//api.getFile(path, callback) // Downloads a file.
		//api.getDelta(cursor, path, callback) // Gets changes to files and folders in a user's Dropbox.

		// Each callback will return the error message, response, and body(json data).
		api.account(function(error, response, body){
			console.log(body.display_name);
		});
	});
});
module.exports = router;