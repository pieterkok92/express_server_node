var express = require('express');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var url = 'mongodb://admin:1234@ds129720.mlab.com:29720/heroku_n1kxz9pj';
var geolib = require('geolib');
mongoose.connect(url);


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var http = require('http');

var app = http.createServer(function(req,res){
    res.setHeader('Content-Type', './substations.geojson');
    res.send(JSON.stringify({}, null, 3));
});
app.listen(3000);
module.exports = router;