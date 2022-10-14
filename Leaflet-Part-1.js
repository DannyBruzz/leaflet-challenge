
function createMap(data) {
let streetmap =    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


let baseMaps = {
   "Street Map": streetmap
  };

let overlayMaps = {
    "Eathquakes": data
};

let myMap = L.map("map", {
    center: [-28.01, 153.4],
    zoom: 13,
    layers: [streetmap, data]
    });  
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);

function createMarkers(response) {

    // Pull the "stations" property from response.data.
    let earthquakes = response.features;
  
    // Initialize an array to hold bike markers.
    let eqMarkers = [];
  
    // Loop through the stations array.
    for (let i = 0; i < earthquakes.length; i++) {
        let row = earthquakes[i]
        let details = row.properties;
        let geometry = row.geometry;
        
        let earthquakesMarker = L.marker([geometry.coordinates[1], geometry.coordinates[0]])
        .bindPopup("<h3>" + details.place + "<h3><h3>Magnitude: " + details.mag + "</h3>");
  
      // Add the marker to the bikeMarkers array.
      eqMarkers.push(earthquakesMarker);
    }
  
    // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
    createMap(L.layerGroup(eqMarkers));
  }