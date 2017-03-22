var toGeoJSON = require('togeojson'),
    fs = require('fs');
// node doesn't have xml parsing or a dom. use xmldom
DOMParser = require('xmldom').DOMParser;

var kml = new DOMParser().parseFromString(fs.readFileSync('substations.kml', 'utf8'));

var converted = toGeoJSON.kml(kml);

var convertedWithStyles = toGeoJSON.kml(kml, { styles: true });

converted["features"].forEach((station) => {
    var coordinate = station["geometry"].coordinates;
    var name = station["properties"].Name;
    console.log(`${coordinate} ${name}`);
});
module.exports = router;