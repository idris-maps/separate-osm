var fs = require('fs')

module.exports = function(dataFolder, callback) {
	fs.rmdir(dataFolder + '/points', function() {
		fs.rmdir(dataFolder + '/lines', function() {
			fs.rmdir(dataFolder + '/polygons', function() {
				fs.mkdir(dataFolder + '/points', function() {
					fs.mkdir(dataFolder + '/lines', function() {
						fs.mkdir(dataFolder + '/polygons', function() {
							callback()
						})
					})
				})
			})
		})
	})
} 
