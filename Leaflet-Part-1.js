
function createMap(data) {
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

let baseMaps = {
   "Street Map": street,
   "Topography":topo
  };
   

let overlayMaps = {
    "Eathquakes": data,
};

let myMap = L.map("map", {
    center: [15.33, 32.93],
    zoom: 3,
    layers: [street, data]
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
        let row = earthquakes[i];
        let details = row.properties;
        let geometry = row.geometry;
        let Fcolor = "";
        let depth = geometry.coordinates[3];
        console.log(details.mag)
        if (depth > 90) {
          Fcolor = "black";
        }
        else if (depth > 70) {
          Fcolor = "purple";
        }
        else if (depth > 50) {
          Fcolor = "violet";
        }
        else if (depth > 30) {
          Fcolor = "red";
        }
        else if (depth > 10) {
            Fcolor = "orange";
        }
        else {
            Fcolor = "yellow";
        } 
       
        if (details.mag > 8) {
            radiusValue = 500000;
          }
          else if (details.mag > 6) {
            radiusValue = 400000;
          }
          else if (details.mag > 4) {
            radiusValue = 300000;
          }
          else if (details.mag > 2) {
            radiusValue = 200000;
          }
          else {
            radiusValue = 100000;
          } 
        let earthquakesMarker = L.circle([geometry.coordinates[1], geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "white",
            fillColor: Fcolor,
            radius: radiusValue
        }).bindPopup("<h3>" + details.place + "<h3><h3>Magnitude: " + details.mag + "</h3>");
        
      eqMarkers.push(earthquakesMarker);
    }
    createMap(L.layerGroup(eqMarkers));
  }
