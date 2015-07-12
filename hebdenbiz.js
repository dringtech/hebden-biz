var layer = new L.StamenTileLayer("watercolor");
var map = new L.Map("map", {
    center: new L.LatLng(53.7416, -2.0175),
    zoom: 12
});
map.addLayer(layer);

var loadGeoJsonLayer = function(src, target, options) {
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
                target = L.geoJson(data, options).addTo(map);
            }

        }
    };
    xhr.send();
};

var postcodes, businesses;

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

var mapLayers = {
    "Postcodes": postcodes,
    "Businesses": businesses
};

L.control.layers(null, mapLayers).addTo(map);

loadGeoJsonLayer('./layers/bizDist.geojson', postcodes, {
                                style: function (feature) {
                                    return {
                                        color: 'green',
                                        radius: feature.properties.count
                                    };
                                },
                                onEachFeature: function (feature, layer) {
                                    layer.bindPopup(feature.properties.name +'<br>' + feature.properties.count);
                                },
                                pointToLayer: function (feature, latlng) {
                                    return L.circleMarker(latlng, geojsonMarkerOptions);
                                }
                            });

loadGeoJsonLayer('./layers/hebdenbiz.geojson', businesses, {
                                style: function (feature) {
                                    return {
                                        color: 'blue',
                                        radius: 2
                                    };
                                },
                                onEachFeature: function ( feature, layer ) {
                                    layer.bindPopup(feature.properties.name);
                                },
                                pointToLayer: function(feature, latlng) {
                                    return L.circleMarker(latlng, geojsonMarkerOptions);
                                }
                            });
