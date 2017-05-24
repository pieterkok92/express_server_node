var toGeoJSON = require('togeojson'),
    fs = require('fs');
// node doesn't have xml parsing or a dom. use xmldom
DOMParser = require('xmldom').DOMParser;

var kml = new DOMParser().parseFromString(fs.readFileSync('powerlines.kml', 'utf8'));

var converted = toGeoJSON.kml(kml);

var convertedWithStyles = toGeoJSON.kml(kml, { styles: true });

converted["features"].forEach((powerline) => {
    var coordinate = powerline["geometry"].coordinates;
    var name = powerline["properties"].Name;
    console.log(`${coordinate} ${name}`);
});
module.exports = router;