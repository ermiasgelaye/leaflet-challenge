// Create satellite map tiles layer
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

// Create a map object
var myMap = L.map("map", {
  center: [30, -30],
  zoom: 2,
  layers: satellite
});

// JSON url for all earthquakes in the past week
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create an earthquakes layer group
var earthquakesLayer = new L.layerGroup();

// Function for binding popups
function onEachFeature(feature, layer) {
  // does this feature have a property named popupContent?
  if (feature.properties && feature.properties.mag) {

    // Convert timestamp to formatted datetime
    var formattedDate = "";
    if (feature.properties.time) {
      var d = new Date(feature.properties.time);
      formattedDate = + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
      var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
      var formattedTime = hours + ":" + minutes;

      formattedDate = formattedDate + " " + formattedTime;
    }

    // Add popup with earthquake information
    layer.bindPopup('<h3>' + feature.properties.place + '</h3><hr>' +
      formattedDate + '<br>' +
      'Magnitude ' + feature.properties.mag + '<br>' +
      '<a href = "' + feature.properties.url + '" target="_blank" >More info</a>'
    );
  }
}

// Get GeoJSON Data
d3.json(url, function (response) {

  console.log(response);

  // Create seismic circle markers using pointToLayer
  L.geoJson(response, {

    pointToLayer: function (feature, latlng) {

      // Grab magnitude
      var mag = feature.properties.mag;

      // Color code markers, skipping null data
      if (typeof mag == "number") {
        if (mag < 1) { circle_color = "greenyellow"; }
        else if (mag < 2) { circle_color = "yellow"; }
        else if (mag < 3) { circle_color = "orange"; }
        else if (mag < 4) { circle_color = "darkorange"; }
        else if (mag < 5) { circle_color = "coral"; }
        else if (mag >= 5) { circle_color = "red"; }
        else { circle_color: "green"; }
      }

      // Set up marker style
      var geojsonMarkerOptions = {
        radius: mag * 2,
        fillColor: circle_color,
        color: circle_color,
        weight: 1,
        opacity: 0.5,
        fillOpacity: 0.5
      };

      return L.circleMarker(latlng, geojsonMarkerOptions);
    },
    onEachFeature: onEachFeature
  }).addTo(earthquakesLayer);

  // Add earthquakesLayer to the map
  earthquakesLayer.addTo(myMap);

});

// Create the background box for the legend
var legendBox = L.control();

// Create a div with a class "legendBox"
legendBox.onAdd = function (map) {
  return L.DomUtil.create('div', 'info');
};

// Add the box to the map
legendBox.addTo(myMap);

// Create a legend in layer control and position it
var legend = L.control({ position: "bottomright" });

// Create the legend div and update the innerHTML
legend.onAdd = function (map) {

  // Create a div with a class "legend"
  var div = L.DomUtil.create('div', 'legendBox legend'),
    mags = [0, 1, 2, 3, 4, 5]

  // Loop through our magnitude intervals and generate a label with a colored square for each interval
  for (var i = 0; i < mags.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getColor(mags[i]) + '"></i> ' +
      mags[i] +
      (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
  }
  return div;
};

// Add the legend to the map
legend.addTo(myMap);

////////////////////////////////////////
// Bonus: Fault Lines and Layer Control
////////////////////////////////////////
var faultLinesLayer = new L.layerGroup();

faultsURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(faultsURL, function (response) {

  // Function for styling fault lines
  function lineStyle(feature) {
    return {
      weight: 2,
      color: "orange",
      opacity: 0.5
    };
  }

  // Add fault lines with styling to layer group
  L.geoJSON(response, {
    style: lineStyle
  }).addTo(faultLinesLayer);

  // Add faultLinesLayer to the map
  faultLinesLayer.addTo(myMap)
})

// Create grayscale map tiles layer
var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Create dark map tiles layer
var dark = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Create outdoor map tiles layer
var outdoor = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token={access_token}", { access_token: API_KEY });

// Create a baseMaps object to contain the different base maps
var baseMaps = {
  Satellite: satellite,
  Grayscale: grayscale,
  Dark: dark,
  Outdoor: outdoor
};

// Create an overlayMaps object
var overlayMaps = {
  Eartquakes: earthquakesLayer,
  "Fault Lines": faultLinesLayer
};

// Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

