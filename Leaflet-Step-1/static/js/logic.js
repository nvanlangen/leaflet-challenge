// URL to return earthquake data over the last week
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create map object
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5
});

// Display the map
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Read the earthquake data 
d3.json(url, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

// Function to set color of each marker based on the magnitude of the earthquake, negative numbers are possible and are converted to 0
function colorMag(magnitude) {
  // switch function here matches magnitude with color
  var color = "";
  if (magnitude < 0) {
    magnitude = 0;
  }
  switch (Math.floor(magnitude)) {
    case 0:
      color = "gray";
      break;
    case 1:
      color = "khaki";
      break;
    case 2:
      color = "yellowgreen";
      break;
    case 3:
      color = "orange";
      break;
    case 4:
      color = "lightcoral";
      break;
    case 5:
      color = "darkblue";
      break;
    default:
      color = "darkred";
  }
  return color;
}

// Set the features for the earthquake markers
function createFeatures(earthquakeData) {
  // Configure a pop up message for each earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "<br>Magnitude: " + feature.properties.mag + "<br></p>");
  }

  // Set the marker as circle and call colorMag function to set the color, radius is magnitude times 3 
  var earthquakes = L.geoJson(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return new L.CircleMarker(latlng, {
        color: colorMag(feature.properties.mag),
        fillColor: colorMag(feature.properties.mag),
        fillOpacity: 0.75,
        radius: feature.properties.mag * 3
      });
    },
    onEachFeature: onEachFeature
  });
  // add earthquake layer to map
  earthquakes.addTo(myMap);
}

// Configure a legend on the bottom page of the window
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    // insert the magnitudes below
    mag = [0, 1, 2, 3, 4, 5, 6],
    labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < mag.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colorMag(mag[i]) + '"></i>'

    // Displays < 1 for the first range because negative values are possible, Displays 6+ for the last range
    if (i == 0) {
      div.innerHTML += '< ' + mag[i + 1] + '<br>'
    }
    else {
      div.innerHTML += mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }
  }

  return div;
};

// Adds legend to the map
legend.addTo(myMap);
