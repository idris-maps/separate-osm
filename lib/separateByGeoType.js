var report = require('./report')
var jf = require('jsonfile')
var fs = require('fs')

module.exports = function(dataFolder, geoType, propsToCheck, callback) {
	jf.readFile(dataFolder + '/' + geoType + '/0__all.json', function(err,data) {
		if(err) { console.log(err) }
		propsExist(propsToCheck, data, function(props) { 
			loopProps(0, dataFolder, props, data, [], function(rest, vals) {
				jf.writeFile(dataFolder + '/' + geoType + '/0__rest.json', rest, function() {
					console.log('wrote ' + dataFolder + '/' + geoType + '/0__rest.json')
					for(i=0;i<vals.length;i++) {
						var v = vals[i]
						var p = v.prop
						var values = v.values
						loopValues(0, dataFolder + '/' + geoType + '/' + p, values, function() { })
					}
					callback()
				})
			})
		})
	})
}

function loopValues(count, dataPath, values, callback) {
	var index = count
	count = count + 1
	if(count === values.length + 1) {
		callback()
	} else {
		var x = values[index]
		var path = dataPath + '_' + x.value + '.json'
		var c = {type:'FeatureCollection', features: x.features}
		jf.writeFile(path, c, function() {
			console.log('wrote ' + path)
			loopValues(count, dataPath, values, callback)
		})
	}
}

function loopProps(count, dataFolder, props, data, vals, callback) {
	var index = count
	count = count + 1
	if(count === props.length + 1) {
		callback(data, vals)
	} else {
		var prop = props[index]
		saveProp(dataFolder, prop, data.features, function(val, rest) {
			vals.push(val)
			loopProps(count, dataFolder, props, rest, vals, callback)	
		})
	}
}

function saveProp(dataFolder, prop, features, callback) {
		var rest = {type:'FeatureCollection',features:[]}
		var values = []
		for(i=0;i<features.length;i++) {
			var f = features[i]
			var p = f.properties
			if(p[prop] !== undefined) {
				var exist = false
				for(j=0;j<values.length;j++) {
					if(values[j].value === p[prop]) {
						values[j].features.push(f)
						exist = true
						break
					}
				}
				if(exist === false) {
					values.push({value: p[prop], features: [f]})
				}
			} else {
				rest.features.push(f)
			}
		}
		callback({prop:prop, values: values}, rest)
}

function propsExist(propsToCheck, data, callback) {
	report(data, 'props', function(props) { 
		var exist = []
		for(i=0;i<propsToCheck.length;i++) {
			for(j=0;j<props.length;j++) {
				if(propsToCheck[i] === props[j]) {
					exist.push(propsToCheck[i])
					break
				}
			}
		}
		callback(exist)
	})
}

