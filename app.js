require('@risingstack/trace');// your application's code
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var fs = require("fs");
var streamingS3 = require('streaming-s3');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var async = require('async');
var app = express();
var request = require('request')

var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;

const CLIENT_ID = '731989435397-9ke9oaum3d59ufg2afhcafv6kp81lcl1.apps.googleusercontent.com';
const CLIENT_SECRET = 'T7WBlfbJhLjhxrWfpqiTvWwd';
const REFRESH_TOKEN = '1/3kJ89ZhWCF9uSt5CINBCO-YmD0dJwIvZ1-GfpmjN6IB-SzBHw6aJUZAWeVofT4Qj';
const ENDPOINT_OF_GDRIVE = 'https://www.googleapis.com/drive/v2';
const PARENT_FOLDER_ID = '0B279ViC0wcvObjdQWlREek5iVmc';

const PNG_FILE = 'P.json';


    
    






// Connection URL
var url = 'mongodb://admin:1234@ds129720.mlab.com:29720/heroku_n1kxz9pj';

let stations = require('./routes/stations');
let getNearest = require('./routes/getNearest');
let getNearest_powerlines = require('./routes/getNearest_powerlines');
//let upload_gdrive = require('./routes/upload-gdrive');



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
app.use('/getNearest', getNearest);
app.use('/getNearest_powerlines', getNearest_powerlines);
//app.use('/upload-gdrive',upload_gdrive);

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

app.get('/upload-AWS', function(req, res){    
  var fStream = fs.CreateReadStream('./P.json');
  var uploader = new streamingS3(fStream, {accessKeyId: 'AKIAIY5SHWOFHZ4SIOKA', secretAccessKey: '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'},
      {
        Bucket: 'nampower-mobile-gis',
        Key: 'P.json',
        ContentType: 'application/json'
      }, function (err, resp, stats) {
    if (err) return console.log('Upload error: ', e);
    console.log('Upload stats: ', stats);
    console.log('Upload successful: ', resp);
    }
  );
});

// app.get('/upload2', function(req, res){
//   var content = fs.readFileSync("./P.json");
//   var json_content = JSON.parse(content);
//   var arr = json_content.features;

//   conn.once('open', function () {
//     console.log('open');
//     var gfs = Grid(conn.db);
    
//     for (i = 0; i < arr.length -1; i++) 
//     {  
//         var writestream = gfs.createWriteStream({
//         filename: 'mongo_file.txt'
//     });
//     //fs.createReadStream().pipe(writestream);
 
    
//   });
  
 
// });

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


app.get('/upload-gdrive',function(req,res){
  async.waterfall([
  //-----------------------------
  // Obtain a new access token
  //-----------------------------
  function(callback) {
    var tokenProvider = new GoogleTokenProvider({
      'refresh_token': REFRESH_TOKEN,
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET
    });
    tokenProvider.getToken(callback);
  },

  function(accessToken, callback) {
    
    var fstatus = fs.statSync(PNG_FILE);
    fs.open(PNG_FILE, 'r', function(status, fileDescripter) {
      if (status) {
        callback(status.message);
        return;
      }
      
      var buffer = new Buffer(fstatus.size);
      fs.read(fileDescripter, buffer, 0, fstatus.size, 0, function(err, num) {
          
        request.post({
          'url': 'https://www.googleapis.com/upload/drive/v2/files',
          'qs': {
             //request module adds "boundary" and "Content-Length" automatically.
            'uploadType': 'multipart'

          },
          'headers' : {
            'Authorization': 'Bearer ' + accessToken
          },
          'multipart':  [
            {
              'Content-Type': 'application/json; charset=UTF-8',
              'body': JSON.stringify({
                 'title': PNG_FILE,
                 'parents': [
                   {
                     'id': PARENT_FOLDER_ID
                   }
                 ]
               })
            },
            {
              'Content-Type': 'application/json',
              'body': buffer
            }
          ]
        }, callback);
        
      });
    });
  },

  //----------------------------
  // Parse the response
  //----------------------------
  function(response, body, callback) {
    var body = JSON.parse(body);
    callback(null, body);
  },

], function(err, results) {
  if (!err) {
    console.log(results);
  } else {
    console.error('---error');
    console.error(err);
  }
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
