require('@risingstack/trace');// your application's code
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var fs = require("fs");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var app = express();

// Connection URL
var url = 'mongodb://admin:1234@ds129720.mlab.com:29720/heroku_n1kxz9pj';

let stations = require('./routes/stations');
let getNearest = require('./routes/getNearest');
let getNearest_powerlines = require('./routes/getNearest_powerlines');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/stations', stations);
app.use('/getNearest', getNearest)
app.use('/getNearest_powerlines', getNearest_powerlines)

app.get('/download', function(req, res){
  var file = __dirname + '/P.json';
  res.download(file); // Set disposition and send it.
});


app.get('/upload', function(req, res){

  let substations = require('./substations.json');

  let substationsArray = substations['features'];

  //mongoose.connect(url);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));  
  MongoClient.connect(url, function(err, db) {
        if(err){
            return res.json( {success: false, message: err });
        }    
      substationsArray.forEach((station)=>{      
        var object = {"_id":station.id,"Name":station.properties.Name,"Geometry":station.geometry.coordinates};
        db.collection('stations').insert(object);
      
      });
  });
});

app.get('/upload2', function(req, res){

  let powerlines = require('./P.json');

  let powerlinesArray = powerlines['features'];

  //mongoose.connect(url);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));  
  MongoClient.connect(url, function(err, db) {
        if(err){
            return res.json( {success: false, message: err });
        }    
      powerlinesArray.forEach((powerline)=>{      
        var object = {"Type":powerline.properties.name,"Geometry":powerline.geometry.coordinates};
        db.collection('powerlines').insert(object);
      
      });
  });
});

app.get('/test',function(req,res){
  var content = fs.readFileSync("./P.json");
  var json_content = JSON.parse(content);
  var arr = json_content.features;

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));  
  MongoClient.connect(url, function(err, db) {
        if(err){
            return res.json( {success: false, message: err });
        }    
    for (i = 0; i < arr.length -1; i++) 
    {   
      //console.log(json_content.features[i].properties.name);
      //console.log(json_content.features[i].geometry.coordinates);
      var lineobj = {"Type":json_content.features[i].properties.name,"Geometry":json_content.features[i].geometry.coordinates};
      db.collection('powerlines').insert(lineobj);
    }
    console.log("Finished");
    });
 });  




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
