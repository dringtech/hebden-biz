var http = require('https');
var fs = require('fs');

var query;
var filename;
var companies = [];

function getParams(obj) {
    return Object.keys(query)
        .map(function(k) {return [k, query[k]].join('=');})
        .join('&');
}

var downloadData = function() {
    var delay = 1000;
    companies = [];
    var getData = function getData(pageNum) {
        if (pageNum === undefined) { pageNum = 1; }
        query.page = pageNum;
        var options = {
            host: 'api.opencorporates.com',
            path: ['/v0.4/companies/search', getParams(query)].join('?')
        };
        http.request(options, saveData).end();
    };

    var saveData = function saveData(response) {
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        if (response.statusCode == 200) {
            var result = JSON.parse(str);
            companies = companies.concat(result.results.companies);
            var page = result.results.page;
            var total_pages = result.results.total_pages;
            fs.writeFile(filename, JSON.stringify(companies), function(err) {
              if (err) {
                console.error('Failed to write page ' + page);
              } else {
                console.log('Page ' + page + ' of ' + total_pages);
                if (page !== total_pages) {
                    setTimeout(function() {getData(query.page + 1);}, delay);
                }
              }
            });
        } else {
          console.log('Returned "' + response.statusMessage + '" (' + response.statusCode + ')');
        }
      });
    };

    getData();
};

var loadData = function loadData() {
    companies = JSON.parse(fs.readFileSync(filename, 'utf8'));
};

var activeBusinesses = function(p) {
    return companies.filter(function(c) {
        return c.company.inactive === false;
    }).
    map(function(c) {
        return {
            name: c.company.name,
            address: c.company.registered_address_in_full,
            postcode: c.company.registered_address_in_full.split(',').pop().trim()
        };
    });
};

module.exports = function(config) {
    filename = config.datafile.company;
    query = config.opencorporatesQuery;
    var persistent = {companies: []};
    loadData(persistent);
    return {
        download: downloadData,
        active: activeBusinesses
    };
};

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
