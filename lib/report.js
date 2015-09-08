var _ = require('underscore')

module.exports = function(collection, query, callback) {
	if(collection.type !== 'FeatureCollection') {
		callback('This is not a geojson FeatureCollection')
	} else {
		if(query === null || query === undefined) {
			callback('Unknown query')
		} else if(query === 'geo') { 
			geo(collection.features, function(r) { callback(r) })
		} else if(query === 'props') {
			keys(collection.features, function(r) { callback(r) })
		} else if(query.substr(0,4) === 'key ') { 
			var key = query.substring(4);
			keySearch(collection.features, key, function(r) { callback(r) })
		} else {
			callback('Unknown query')
		}
	}
}

function geo(features, callback) {
	var geoTypes = []
	var props = []

	for(i=0;i<features.length;i++) {
		var f = features[i];
		var geoType = f.geometry.type;
		var exist = false;
		for(j=0;j<geoTypes.length;j++) {
			if(geoType === geoTypes[j].type) {
				geoTypes[j].count = geoTypes[j].count + 1;
				exist = true;
				break
			}
		}
		if(exist === false) {
			geoTypes.push({type:geoType, count: 1})
		}
	}
	callback({nb: geoTypes.length, types: geoTypes})
} 

function keys(features, callback) {
	var props = []
	keysLoop(0, features, props, function(uniqProps) {
		var sortedProps = uniqProps.sort()
		callback(sortedProps)
	})
} 

function keysLoop(count, features, props, callback) {
	var index = count;
	count = count + 1;
	if(count === features.length + 1) {
		callback(props)
	} else {
		var f = features[index];
		var p = f.properties;
		var propKeys = [];
		for(var key in p) { 
			if(p[key] !== undefined && p[key] !== null && p[key] !== 'no') {
				propKeys.push(key)
			} 
		}
		featPropsLoop(0, propKeys, props, function(updProps) {
			setTimeout(function() {
				if(count/1000 === Math.floor(count/1000)) {
					console.log('checked ' + count + ' of ' + features.length + ' features');
				}
				keysLoop(count, features, updProps, callback);
			}, 1)
		})
	}
}

function featPropsLoop(count, propKeys, props, callback) {
	var index = count;
	count = count + 1;
	if(count === propKeys.length + 1) {
		callback(props)
	} else {
		var pKey = propKeys[index];
		var exist = false;
		for(i=0;i<props.length;i++) {
			if(pKey === props[i]) { exist = true; break }
		}	
		if(exist === false) {
			props.push(pKey)
		}
		featPropsLoop(count, propKeys, props, callback)
	}
}

function keySearch(features, key, callback) {
	var vals = []
	for(i=0;i<features.length;i++) {
		var f = features[i];
		var p = f.properties;	
		var val = f.properties[key];
		vals.push(val)
	}
	var uniqVals = _.uniq(vals);
	if(features.length === uniqVals.length) {
		var info = 'ALL VALUES ARE UNIQUE'
	} else if(uniqVals.length === 1) {
		var info = 	'ONLY ONE VALUE: ' + uniqVals[0]
	} else {
		var info = {}
		var types = []
		var values = []
		for(i=0;i<uniqVals.length;i++) {
			var v = uniqVals[i];
			values.push(v)
			types.push(typeof v)
		}
		var uniqTypes = _.uniq(types)
		var uniqValues = _.uniq(values)
		if(uniqTypes.length === 1) {
			info.type = uniqTypes[0]
		} else {
			info.type = uniqTypes
		}
		var sortedValues =  uniqValues.sort()
		info.min = sortedValues[0]
		info.max = sortedValues[sortedValues.length - 1]
		var countValues = []
		for(i=0;i<sortedValues.length;i++) {
			countValues.push({val: sortedValues[i], count: 0})
		}
		for(i=0;i<features.length;i++) {
			var f = features[i];
			var p = f.properties;	
			var val = f.properties[key];
			var valExist = false;
			for(j=0;j<countValues.length;j++) {
				if(val === countValues[j].val) {
					countValues[j].count = countValues[j].count + 1;
					break;
				}
			}
		}
		info.values = _.sortBy(countValues, 'count')
	}
	callback(info)
}
