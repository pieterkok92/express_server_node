var express = require('express');
var app = express();
var path = require('path');

app.get('/download', function(req, res){
  var file = __dirname + '/upload-folder/substations.geojson';
  res.download(file); // Set disposition and send it.
});

module.exports = router;




