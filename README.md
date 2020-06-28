# leaflet-challenge
Visualizing Data with Leaflet

## Step 1

Retrieved earthquake data for the last week from the USGS website.

Created a street map and plotted each earthquake on the map using circle markers.  The markers were colored and sized based on the magnitude of the earthquake.  Clicking on a marker will display information about the earthquake.

A map legend was created to show the magnitude range and color.

## Step 2

Retrieved earthquake data for the last week and month from the USGS website.  Selected tectonic plate data from https://github.com/fraxen/tectonicplates.

Created a base maps layer containing a street map, a satellite map, and a dark map.

Imported javascript code from, https://github.com/ismyrnow/leaflet-groupedlayercontrol, to create a grouped layer control.  This allows multiple grouping of layers.  The base layer only allows one option to be selected at a time.  The grouped layer control allows the overlay layers to also be limited to one option at a time.  This was used to display the earthquake data for either the entire week or month on any of the base map options.  The tectonic plates can still be toggled on or off.

The same circle markers, pop up messages, and legend that were used in Step 1 were also used in Step 2.
