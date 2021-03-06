var express = require('express');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var url = 'mongodb://admin:1234@ds129720.mlab.com:29720/heroku_n1kxz9pj';
var geolib = require('geolib');
var fs = require('fs');
mongoose.connect(url);


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
        //   db.collection('powerlines').find({}).limit(5000).toArray((err, stations)=>{
        //     if(err){
        //         return res.json( {success: false, message: err });
        //     }

        //     return res.json({success: true, stations: stations});            
        // }); 

         var path;
        db.collection('powerlines', function(err, collection) 
        {
            collection.find({}).toArray(function(err, results) 
            {
                path = results;
                //console.log(path);
                //res.download(path);
                
            });
        });

        fs.writeFile('./test.txt', path,  function(err) {
        if (err) {
            return console.error(err);
        }
        
        console.log("Data written successfully!");
        console.log("Let's read newly written data");
        fs.readFile('./test.txt', function (err, data) {
            if (err) {
                return console.error(err);
            }
            console.log("Asynchronous read: " + data.toString());
        });
        });

    });
});
module.exports = router;

