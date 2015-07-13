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
