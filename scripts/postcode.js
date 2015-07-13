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
