let myMap = L.map("map", {
    center: [-28.01, 153.4],
    zoom: 13
  });
  
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);