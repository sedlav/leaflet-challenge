// Create a map object
var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 4
});

// Add tile layer 
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: "pk.eyJ1Ijoic2VkbGF2IiwiYSI6ImNrMW8wNWFyNjBnYjMzbHFmY2Q1ODhjeDQifQ.zsDfcc4M9KjdGr5_U-NCVw"
}).addTo(myMap);


// Function for color-coding
function circleColor(magnitude) {
    if (magnitude <= 3) {
      return "green";
    }
    else if (magnitude > 3 && magnitude <= 5.9) {
      return "yellow";
    }
    else {
      return "red";
    }
}

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(link, function(data) {
  var earthquakes = data.features;
  console.log(earthquakes)
  for (var i = 0; i < earthquakes.length; i++) {
    var earthquake = earthquakes[i];
    var magnitude = earthquake.properties.mag; 

  // Adding circular markers + popups 
    L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      fillOpacity: 0.9,
      color: "white",
      weight: 1,
      fillColor: circleColor(+magnitude),
      radius: (magnitude * 20000)
    }).bindPopup("<h1>" + earthquake.properties.place + "</h1> <hr> <h3>Magnitude: " + magnitude + "</h3>").addTo(myMap).addTo(myMap); 
  };
});

// Legend 
var legend = L.control({position: 'topright'});
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var labels = ["Mild (0 to 3)", "Mid Severity (3+ to 6)", "Severe (6+)"];
    var levels = [0, 4, 6]
    div.innerHTML = '<div><strong>Legend</strong></div>';
    for(var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style = "background: ' + circleColor(levels[i]) + '">&nbsp;</i>&nbsp;&nbsp;'
      + labels[i] + '<br/>';
    };
    return div;
  };
legend.addTo(myMap);