// URLs to get earthquake data for the last week and month.  URL to get Tectonic Plate boundaries
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var url30 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var urlPlates = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Declaring empty variables to be available globally
var plates;
var earthquakes;
var earthquakes30;

// Read the tectonic plate data
d3.json(urlPlates, function (data) {
  plates = L.geoJSON(data.features);
});

// Read the earthquake data for the last week
d3.json(url, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  earthquakes = createFeatures(data.features);
});

// Read the earthquake data for the last month
d3.json(url30, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  earthquakes30 = createFeatures(data.features);
  // Call createMap function to display the initial map
  createMap();
});

// Function set the color of each earthquake marker and the legend color based on magnitude
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

// Function to set the features of the earthquake markers
function createFeatures(earthquakeData) {
  // Configures popup message for each earthquake marker
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "<br>Magnitude: " + feature.properties.mag + "<br></p>");
  }

  // Creates circle markers for eachearthquake, calls colorMag to get color, radius is magnitiude times 3
  var earthquake = L.geoJson(earthquakeData, {
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

  return earthquake;
}

// Function to create the map
function createMap() {

  // Configures street map
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Configures satellite map
  //mapbox://styles/mapbox/satellite-v9
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
  });

  // Configures dark map
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Satellite Map": satellitemap,
    "Dark Map": darkmap
  };

  // Define a groupedOverlays object to hold overlay layers
  var groupedOverlays = {
    "Earthquakes": {
      "Last 7 Days": earthquakes,
      "Last 30 Days": earthquakes30
    },

    "Tectonic Plates": { "Plates": plates }
  };

  // Set options for the groupedOverlays
  var options = {
    // Make the Earthquakes group exclusive (use radio inputs)
    exclusiveGroups: ["Earthquakes"],
    // Show a checkbox next to Tectonic Plates options
    groupCheckboxes: false,
    // Do not collapse the control layer
    collapsed: false
  };

  // Create map object, default is Street Map, Earthquakes in Last Week, and Show Tectonic Plates
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakes, plates]
  });

  // Show the map with the selected options
  L.control.groupedLayers(baseMaps, groupedOverlays, options).addTo(myMap);

  // Show a legend in the bottom right of the window
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

      if (i == 0) {
        div.innerHTML += '< ' + mag[i + 1] + '<br>'
      }
      else {
        div.innerHTML += mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
      }
    }

    return div;
  };

  legend.addTo(myMap);
}



