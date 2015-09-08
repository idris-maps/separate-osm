#separate-osm

When converting ```.osm``` files with [osmtogeojson](https://github.com/tyrasd/osmtogeojson), you get one ```.geojson``` file with all the features. This tools aims at separating the files, first by type (points, lines and polygons), then by property.

Properties are defined by geometry type in the ```config.js``` file.

##Use

Clone this repository and install the dependencies

```
$ git clone https://github.com/idris-maps/separate-osm.git
$ npm install
```

Put a ```.geojson``` file converted with [osmtogeojson](https://github.com/tyrasd/osmtogeojson) in the ```data``` folder.

Modify ```run.js``` to include your file. It is this line:

```
var data = require('./data/yourFile.json')
```

And run it with
```
$ node run
```

The separated files are in the ```data/points```, ```data/lines``` and ```data/polygons``` folders. In each of them you will find a ```0__all.json``` file with all the features for this geometry type and a ```0__rest.json``` file with the features that have not been separated. Check the latter for further properties to include in ```config.js```

