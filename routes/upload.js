let substations = require('./substations.json');

let substationsArray = substations['features'];

substationsArray.forEach((station)=>{ console.log(station.geometry);  });