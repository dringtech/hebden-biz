# hebden.biz

## Datasets

### OpenCorporates

* https://opencorporates.com/

OpenCorporates data matching registered address HX7

    https://api.opencorporates.com/v0.4/companies/search?registered_address=HX7&page=x

NB The API is limited to 20 pages unless providing an `api_token` as a parameter to the call.

### Ordnance Survey

Ordnance Survey Code-Point Open

* https://www.ordnancesurvey.co.uk/business-and-government/products/code-point-open.html

This is processed using the [`gbify-geojson`](https://github.com/rob-murray/gbify-geojson) library to convert OS Grid references to WGS84.

### Postcode region

The Halifax postcode areas were downloaded from the wikipedia page https://en.wikipedia.org/wiki/HX_postcode_area, and converted into a GeoJSON layer using [toGeoJson](http://mapbox.github.io/togeojson/)

## Standards and Tools

* http://leafletjs.com/
* http://maps.stamen.com/#watercolor
* http://geojson.org/
* http://mapbox.github.io/togeojson/
