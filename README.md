node-couchpotato
================
Node interface for [CouchPotato](http://www.couchpota.to/).

**Not properly tested yet**

Work In Progress.

Usage example
================
```javascript
var CouchPotato = require('couchpotato');

var couchpotato = new CouchPotato({
	url: 'http://192.168.0.17:5050/', 
	apikey: 'a6ee144e54bf48b49dae6ceddff60eef', 
	debug: true
	});

couchpotato.movie.progress().then(function(r) {
	console.log(r);
});
```
