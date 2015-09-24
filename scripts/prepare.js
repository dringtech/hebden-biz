#!/usr/bin/env node

var yaml = require('yamljs');
var config = yaml.load('config.yml');

var company = require('./company')(config);
var postcode = require('./postcode')(config);

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

fs.writeFile('layers/bizDist.geojson', JSON.stringify(postcodesWithBiz), errHandler);
fs.writeFile('layers/hebdenbiz.geojson', JSON.stringify(locatedBiz), errHandler);

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
