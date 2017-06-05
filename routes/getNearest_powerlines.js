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
router.get('/', function(req, res, next) {
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
        db.collection('powerlines', function(err, collection) {
        collection.find({}).toArray(function(err, results) {
        path = results;
        //console.log(results);
        });
        var stream = fs.createWriteStream("my_file.txt");
        stream.once('open', function(fd) {
        stream.write(path);
        stream.end();
        });
     
      
    });


  
});
module.exports = router;

