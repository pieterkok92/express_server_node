var http = require('http');

var app = http.createServer(function(req,res){
    res.setHeader('Content-Type', './substations.geojson');
    res.send(JSON.stringify({}, null, 3));
});
app.listen(3000);