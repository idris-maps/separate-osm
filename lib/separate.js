var init = require('./initialiseDataFolder.js')
var geoTypes = require('./separateGeoTypes')
var sep = require('./separateByGeoType')
var config = require('../config')

module.exports = function(data) {
	init('./data', function() {
		geoTypes(data, function() {
			sep('./data', 'points', config.pointProperties, function() {
				sep('./data', 'lines', config.lineProperties, function() {
					sep('./data', 'polygons', config.polygonProperties, function() {
						console.log('done')
					})
				})
			})
		})
	})
}

