let substations = require('./substations.geojson');

let substationsArray = substations['features'];

substationsArray.forEach((station)=>{ console.log(station.geometry);  });