var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017/myproject';


var findDocuments = (db, callback) => {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({'a': 3}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });      
}

/* GET home page. */
router.get('/', function(req, res, next) {
  // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
        if(err){
            return res.json( {success: false, message: err });
        }


        db.collection('stations').find({}).toArray((err, stations)=>{
            if(err){
                return res.json( {success: false, message: err });
            }

            return res.json({success: true, stations: stations});
        });

    });
  
  
});

router.post('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({'a': 3}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });      
}

module.exports = router;




