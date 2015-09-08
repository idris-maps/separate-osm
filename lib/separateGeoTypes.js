var jf = require('jsonfile')

module.exports = function(collection, callback) {
	var polys = []
	var lines = []
	var points = []
	checkLoop(0, collection.features, polys, lines, points, function(pl,li,pt) {
		var plColl = {type: 'FeatureCollection', features: pl}
		var liColl = {type: 'FeatureCollection', features: li}
		var ptColl = {type: 'FeatureCollection', features: pt}
		jf.writeFile('data/polygons/0__all.json', plColl, function(err) {
			if(err) { callback(err) } else { console.log('wrote data/polygons/0__all.json') }
			jf.writeFile('data/lines/0__all.json', liColl, function(err) {
				if(err) { callback(err) } else { console.log('wrote data/lines/0__all.json') }
				jf.writeFile('data/points/0__all.json', ptColl, function(err) {
					if(err) { callback(err) } else { console.log('wrote data/points/0__all.json') }
					callback(plColl, liColl, ptColl)
				})
			})
		})
	})
}

function checkLoop(count, features, polys, lines, points, callback) {
	var index = count;
	count = count + 1;
	if(count === features.length + 1) {
		callback(polys, lines, points)
	} else {
		var f = features[index];
		var geoType = f.geometry.type;
		if(geoType === 'Point' || geoType === 'MultiPoint') { points.push(f) } 
		if(geoType === 'LineString' || geoType === 'MultiLineString') { lines.push(f) } 
		if(geoType === 'Polygon' || geoType === 'MultiPolygon') { polys.push(f);}
		setTimeout(function() {
				if(count/1000 === Math.floor(count/1000)) {
					console.log('checked ' + count + ' of ' + features.length + ' features');
				}
			checkLoop(count, features, polys, lines, points, callback)
		},1)
	}
}
