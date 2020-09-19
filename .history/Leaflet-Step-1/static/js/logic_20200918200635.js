
// Creating map object
var map = L.map("map", {
    center: [39.50, -98.35],
    zoom: 2.25
   
  });


  // Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(map);


// If data.beta.nyc is down comment out this link
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
// var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
  function markerSize(mags) {
    return mags * 40000;
  } 


function getColor(d) {
  return d > 5 ? '#FF4500' :
    d > 4 ? '	#FF8C00' :
      d > 3 ? '#FFFF00' :
        d > 2 ? '#9ACD32' :
          d > 1 ? '#556B2F' :
            '#00FF00';
}
}
  // Perform a GET request to the query URL
d3.json(queryUrl, function(data) {


    for(var i = 0; i < data.features.length; i++){

        L.circle(data.features[i].geometry.coordinates.reverse().slice(1), {
            fillOpacity: 0.75,
            color: "white",
            fillColor: getColor(data.features[i].properties.mag),
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its population
            radius: markerSize(data.features[i].properties.mag)
          }).bindPopup("<h1>" + data.features[i].properties.place + "</h1> <hr> <h3>Magnitude: " + data.features[i].properties.mag + "</h3> <h3>Time: " +   new Date(data.features[i].properties.time) + "</h3>")
          .addTo(map);
    }
   
  });
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1,2,3,4,5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
  


