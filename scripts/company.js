var http = require('http');
var fs = require('fs');

var query = {
    registered_address: "HX7",
    // per_page: "100",
};

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
            console.log('Page ' + page + ' of ' + total_pages);
            fs.writeFile(filename, JSON.stringify(companies));
            if (page !== total_pages) {
                setTimeout(function() {getData(query.page + 1);}, delay);
            }
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

module.exports = function(fnam) {
    filename = fnam;
    var persistent = {companies: []};
    loadData(persistent);
    return {
        download: downloadData,
        active: activeBusinesses
    };
};
