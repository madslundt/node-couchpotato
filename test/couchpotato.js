var assert = require("assert");
var CouchPotato = require('../lib/couchpotato.js');

var couchpotato = new CouchPotato({
	url: 'http://192.168.0.17:5050/',
	apikey: 'a6ee144e54bf48b49dae6ceddff60eef', 
	debug: true
	});

couchpotato.available().then(function(r) {
	assert.equal(0, r);
});
