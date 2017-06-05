var express = require('express');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var url = 'mongodb://admin:1234@ds129720.mlab.com:29720/heroku_n1kxz9pj';
var geolib = require('geolib');
var fs = require('fs');
mongoose.connect(url);
var node_dropbox = require('node-dropbox');



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


//geolib.getDistance(object start, object end)

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

		node_dropbox.Authenticate('os6d36r922c1xbv', 'os6d36r922c1xbv', 'https://nampowermobilegis.herokuapp.com/getNearest_powerlines', function(err, url){
			// redirect user to the url.
			// looks like this: "https://www.dropbox.com/1/oauth2/authorize?client_id=<key_here>&response_type=code&redirect_uri=<redirect_url_here>"
		});
		node_dropbox.AccessToken('os6d36r922c1xbv', 'os6d36r922c1xbv', 'ZC38k3IQhxAAAAAAAAAA0Ep21gRB6FuKMAbbmj5Y3IKRJXZIubsMTD_c5-J87wdL', 'https://nampowermobilegis.herokuapp.com/getNearest_powerlines', function(err, body) {
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