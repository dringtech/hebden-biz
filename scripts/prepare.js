var company = require('./company')('../datasets/companies.json');
var postcode = require('./postcode')('../datasets/postcode.json');

// postcode.parse('os/hx.csv');

var active = company.active();
var codepoint = postcode.data();

var biz = active.map(function(x) {
    if (codepoint.hasOwnProperty(x.postcode)) {
        if ('count' in codepoint[x.postcode].properties) {
            codepoint[x.postcode].properties.count++;
        } else {
            codepoint[x.postcode].properties.count = 1;
        }
    } else {
        console.log(":" + x.postcode + ": is unknown...");
    }
});

postcodesWithBiz = {
    type: "featureCollection",
    features: Object.keys(codepoint)
        .filter(function(x) {return 'count' in codepoint[x].properties;})
        .map(function(x) {return codepoint[x];})
};

locatedBiz = {
    type: "featureCollection",
    features: active.filter(function(x) {return x.postcode in codepoint;})
        .map(function(x) {
            var feature = JSON.parse(JSON.stringify(codepoint[x.postcode]));
            var angle = Math.random()*2*Math.PI;
            var r = Math.random()*0.0005;
            feature.geometry.coordinates[0] += r*Math.random()*Math.sin(angle);
            feature.geometry.coordinates[1] += 0.5*r*Math.cos(angle);
            feature.properties = x;
            return feature;
    })
};

var fs = require('fs');
var errHandler = function errHandler(err) { if (err) throw err; };

fs.writeFile('../layers/bizDist.geojson', JSON.stringify(postcodesWithBiz), errHandler);
fs.writeFile('../layers/hebdenbiz.geojson', JSON.stringify(locatedBiz), errHandler);
