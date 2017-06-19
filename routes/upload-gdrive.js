var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;

const CLIENT_ID = '731989435397-9ke9oaum3d59ufg2afhcafv6kp81lcl1.apps.googleusercontent.com';
const CLIENT_SECRET = 'T7WBlfbJhLjhxrWfpqiTvWwd';
const REFRESH_TOKEN = '1/3kJ89ZhWCF9uSt5CINBCO-YmD0dJwIvZ1-GfpmjN6IB-SzBHw6aJUZAWeVofT4Qj';
const ENDPOINT_OF_GDRIVE = 'https://www.googleapis.com/drive/v2';
const PARENT_FOLDER_ID = '0B279ViC0wcvObjdQWlREek5iVmc';

const PNG_FILE = 'P.json';

var async = require('async'),
    request = require('request'),
    fs = require('fs');


router.get('/', function(req, res) {

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
    module.exports = router;