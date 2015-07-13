var layer = new L.StamenTileLayer("watercolor");
var map = new L.Map("map", {
    center: new L.LatLng(53.7416, -2.0175),
    zoom: 12
});
map.addLayer(layer);

var loadGeoJsonLayer = function(src, options) {
    var xhr = new XMLHttpRequest();

    xhr.open('get', src, true);
    xhr.onreadystatechange = function() {
        var status;
        var data;
        if (xhr.readyState == 4) {
            status = xhr.status;
            console.log("it done!");
            if (status == 200) {
                console.log("it success!");
                data = JSON.parse(xhr.responseText);
                L.geoJson(data, options).addTo(map);
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
                                style: function (feature) {
                                    return {
                                        color: 'red',
                                    };
                                },
                                onEachFeature: function ( feature, layer ) {
                                    layer.bindPopup(feature.properties.name);
                                }
                            });

loadGeoJsonLayer('./layers/bizDist.geojson', {
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

