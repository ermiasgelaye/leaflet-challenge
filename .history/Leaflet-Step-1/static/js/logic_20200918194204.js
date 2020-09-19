// Create the tile layer that will be the background of our map
var Outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.light",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.darkmap",
    accessToken: API_KEY
});

var Satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 10,
    id: "mapbox.Satellite",
    accessToken: API_KEY
});
const baseMaps = {
    darkmap: darkmap,
    Satellite: Satellite,
    Outdoors: Outdoors
};

// Initialize all of the LayerGroups we'll be using
var layers = {
    layer21: new L.LayerGroup(),
    layer120: new L.LayerGroup(),
    layer123: new L.LayerGroup(),
    layer734: new L.LayerGroup(),
    layer245: new L.LayerGroup(),
    layer5aplus: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
    center: [39.876019, -117.224121],
    zoom: 6,
    layers: [
        layers.layer21,
        layers.layer120,
        layers.layer123,
        layers.layer734,
        layers.layer245,
        layers.layer5aplus
    ]
});

// Add our 'lightmap' tile layer to the map
Outdoors.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
    "0-1": layers.layer21,
    "1-2": layers.layer120,
    "2-3": layers.layer123,
    "3-4": layers.layer734,
    "4-5": layers.layer245,
    "5+": layers.layer5aplus
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(baseMaps, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
    position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function () {
    var div = L.DomUtil.create("div", "legend")
    return div;
};


// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var color = {
    layer21: "greenblue",
    layer120: "blue",
    layer123: "gold",
    layer734: "green",
    layer245: "darkblue",
    layer5aplus: "purple"
};

// Perform an API call to the Citi Bike Station Information endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function (EarthquakeData) {
    EarthquakeDataArray = EarthquakeData.features

    // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
    // var stationStatusCode;
    var EarthquakeRange;


    // Loop through the stations (they're the same size and have partially matching data)
    for (var i = 0; i < EarthquakeDataArray.length; i++) {
        console.log(EarthquakeDataArray[0]);
        var latitude = EarthquakeDataArray[i].geometry.coordinates[1];
        var longitude = EarthquakeDataArray[i].geometry.coordinates[0];
        var magnitude = EarthquakeDataArray[i].properties.mag;

        if (magnitude > 5) {
            EarthquakeRange = "layer5aplus";
        }
        else if (magnitude > 4) {
            EarthquakeRange = "layer245";
        }
        else if (magnitude > 3) {
            EarthquakeRange = "layer734";
        }
        else if (magnitude > 2) {
            EarthquakeRange = "layer123";
        }
        else if (magnitude > 1) {
            EarthquakeRange = "layer120";
        }
        else {
            EarthquakeRange = "layer21";
        }


        var newMarker = L.circleMarker([latitude, longitude],
            {
                radius: magnitude * 8,
                fillOpacity: 1,
                fillColor: color[EarthquakeRange],
                color: "white",
                weight: 1
            });//  ,
        // {}
        // );
        newMarker.addTo(layers[EarthquakeRange]);

        newMarker.bindPopup("Place: " + EarthquakeDataArray[i].properties.place + "<br> Magnitude: " + magnitude + "<br>");

        updateLegend();

    };

});


function updateLegend() {
    document.querySelector(".legend").innerHTML = [
        "<p class='layer21'>0-1" + "</p>",
        "<p class='layer120'>1-2" + "</p>",
        "<p class='layer123'>2-3" + "</p>",
        "<p class='layer734'>3-4" + "</p>",
        "<p class='layer245'>4-5" + "</p>",
        "<p class='layer5aplus'>5+" + "</p>"
    ].join("");
}