var express = require('express');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var url = 'mongodb://admin:1234@ds129720.mlab.com:29720/heroku_n1kxz9pj';
var geolib = require('geolib');
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
        //db.collection('powerlines').find().toArray(function(err, items) {});
        //var collection = db.collection('powerlines');
        var collection = db.collection('powerlines');
        var stream = collection.find({})
            .stream()
            .pipe(res)
        // db.collection('powerlines').find({}).limit(10000).toArray((err, stations)=>{
        //     if(err){
        //         return res.json( {success: false, message: err });
        //     }

        //     return res.json({success: true, stations: stations});
        // });

    });
  
  
});
module.exports = router;


 
    