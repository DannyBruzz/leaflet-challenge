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
    
      let call = d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);
    
    let overlayMaps = {
        "Eathquakes": data,
        "Test": call
    };
    
    let myMap = L.map("map", {
        center: [15.33, 32.93],
        zoom: 3,
        layers: [street, data]
        });  
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    createLegend(myMap);
  }
    
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
        let depth = geometry.coordinates[2];
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
        }).bindPopup("<h3>" + details.place + "<h3><h3>Magnitude: " + details.mag + "</h3><h3>Depth (km): " + depth + "</h3>");
        
        eqMarkers.push(earthquakesMarker);
    }
    return L.layerGroup(eqMarkers);
    };
  
  function createLegend(map) {
  let legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function(map) {
  let div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Depth (km):</h4>";
  div.innerHTML += '<i style="background: #FFFF00"></i><span>-10-10</span><br>';
  div.innerHTML += '<i style="background: #FFA500"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: #FF0000"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: #EE82EE"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: #800080"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: #000000"></i><span>90+</span><br>';
  
  return div;
  };
  
  legend.addTo(map);
  }
  
  
  
  fetch('PB2002_boundaries.json')
    .then(response => response.json())
    .then(data => {
      let boundary = data.features;
      let techPlate = [];
      for (let i = 0; i < boundary.length; i++) {  
        let row = boundary[i];
        let coord = row.geometry.coordinates;
        let outline = [];
        for (let i = 0; i < coord.length; i++) {  
          let item = coord[i];
          let lat = item[1];
          let lng = item[0];
          outline.push([lat,lng])
        };
        let boundaryLine = L.polyline(outline, {
          color: "red",
        });
      techPlate.push(boundaryLine); 
    }
    createMap(L.layerGroup(techPlate));
  });
  