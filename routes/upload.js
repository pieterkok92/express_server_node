
var toGeoJSON = require('togeojson'),
    fs = require('fs');
// node doesn't have xml parsing or a dom. use xmldom
DOMParser = require('xmldom').DOMParser;

let substations = require('./substations.json');

let substationsArray = substations['features'];

substationsArray.forEach((station)=>{ console.log(station.geometry);  });