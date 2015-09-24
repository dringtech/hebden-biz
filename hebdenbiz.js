var watercolor = new L.StamenTileLayer("watercolor");
var toner = new L.StamenTileLayer("toner");
var osm = new L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
var control = new L.control.layers({"Stamen Watercolor": watercolor, "Stamen Toner": toner, "Open Street Map": osm}, {}, {autoZIndex: false, collapsed: true});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');

    div.innerHTML = '<h1>Legend:</h1><ul>'+
      '<li><svg height="20" width="20" viewbox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="green"></circle></svg>Summarised Business Data</li>'+
      '<li><svg height="20" width="20" viewbox="0 0 100 100"><circle cx="50" cy="50" r="30" fill="blue"></circle></svg>Individual Business Data</li>'+
      '</ul>';
    return div;
};

var map = new L.Map("map", {
    center: new L.LatLng(53.7416, -2.0175),
    zoom: 12
});
map.addLayer(watercolor);
control.addTo(map);
legend.addTo(map);
map.attributionControl.addAttribution("Business data from <a href='https://opencorporates.com/'>OpenCorporates</a>");

var loadGeoJsonLayer = function(src, options) {
    var xhr = new XMLHttpRequest();

    xhr.open('get', src, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        if (xhr.readyState == 4) {
            status = xhr.status;
            if (status == 200) {
                data = JSON.parse(xhr.responseText);
                var gj = L.geoJson(data, options);
                gj.getAttribution = function() { return options.attribution; };
                gj.addTo(map);
                control.addOverlay(gj, options.name);
            }
        }
    };
    xhr.send();
};

// loadGeoJsonLayer('./datasets/hx7.geojson', {
//                     style: function (feature) {
//                         return {color: 'red'};
//                     },
//                     onEachFeature: function (feature, layer) {
//                         layer.bindPopup(feature.properties.name);
//                     }
//                 });

var geojsonMarkerOptions = {
    radius: 8,
    // fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

loadGeoJsonLayer('./layers/hx_postcode_area.geojson', {
                                name: 'Postcode area',
                                attribution: "Postcode area data from <a href='https://en.wikipedia.org/wiki/HX_postcode_area'>Wikipedia</a> (processed with <a href='http://mapbox.github.io/togeojson/'>toGeoJson</a>)",
                                style: function (feature) {
                                    return {
                                        color: 'red',
                                    };
                                }
                            });

loadGeoJsonLayer('./layers/bizDist.geojson', {
                                name: 'Aggregated business data',
                                style: function (feature) {
                                    return {
                                        color: 'green',
                                        radius: feature.properties.count,
                                        fillOpacity: 0.4,
                                        stroke: 0
                                    };
                                },
                                onEachFeature: function (feature, layer) {
                                    layer.bindPopup(feature.properties.name +'<br>' + feature.properties.count);
                                },
                                pointToLayer: function (feature, latlng) {
                                    return L.circleMarker(latlng, geojsonMarkerOptions);
                                }
                            });

loadGeoJsonLayer('./layers/hebdenbiz.geojson', {
                                name: 'Individual business data',
                                style: function (feature) {
                                    return {
                                        color: 'blue',
                                        radius: 4,
                                        fillOpacity: 0.4,
                                        stroke: 0
                                    };
                                },
                                onEachFeature: function ( feature, layer ) {
                                    layer.bindPopup(feature.properties.name);
                                },
                                pointToLayer: function(feature, latlng) {
                                    return L.circleMarker(latlng, geojsonMarkerOptions);
                                }
                            });

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Dring Technology Solutions Ltd / Giles Dring
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
