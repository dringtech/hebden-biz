var fs = require('fs');
var gbify = require('gbify-geojson');

var fileName;

var postcodes;
var postcodesGeo;

var parseData = function parseData(sourceFile) {
    fs.readFile(sourceFile, {encoding: 'utf8'}, function(err, sourceData) {
        if (err) throw err;
        postcodes = {};
        postcodesGeo = sourceData.replace(/[\"\r]/g,'')
            .split('\n')
            .filter(function(line) {
                return line.match('HX7');
            })
            .map(function(x) {
                return x.split(',').filter(function(y, i) {
                    return [0, 2, 3].indexOf(i) > -1;
                });
            })
            .map(function(pcode) {
                var osgrid = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [ parseFloat(pcode[1]), parseFloat(pcode[2]) ]
                    },
                    properties: {
                        name: pcode[0]
                    }
                };
                var wgs84 = gbify.toWGS84(osgrid);
                postcodes[pcode[0]] = wgs84;
                return wgs84;
            });

        fs.writeFile(fileName, JSON.stringify(postcodes), function(err) {
            if (err) throw err;
        });
        fs.writeFile("hx7.geojson", JSON.stringify(postcodesGeo), function(err) {
            if (err) throw err;
        });
        console.log(JSON.stringify(postcodes, null, 2));
    });
};

var loadData = function loadData() {
    postcodes = JSON.parse(fs.readFileSync(fileName, 'utf8'));
};

module.exports = function(fnam) {
    fileName = fnam;
    loadData();
    return {
        parse: parseData,
        data: function() { return postcodes; } 
    };
};


/*
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
  "properties": {
    "name": "Dinagat Islands"
  }
}
*/
