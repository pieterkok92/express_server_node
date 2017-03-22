var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var http = require('http');
// Connection URL
var url = 'mongodb://admin:1234@ds129720.mlab.com:29720/heroku_n1kxz9pj';


/* GET home page. */
router.get('/', function(req, res, next) {
 // Use connect method to connect to the server
    

    var app = http.createServer(function(req,res){
    res.setHeader('Content-Type', './substations.geojson');
    res.send(JSON.stringify({}, null, 3));
    response.write(JSON.stringify('./substations.geojson'));
});
      
  
});

router.post('/', function(req, res, next) {
  res.json({ title: 'Express' });
});

module.exports = router;




