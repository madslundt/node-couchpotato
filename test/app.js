console.log("Starting");

var couchpotato = require('./lib/couchpotato.js');
var couchpotatoClient = new couchpotato({
	host: 'http://192.168.0.17:5050',
	key: 'a6ee144e54bf48b49dae6ceddff60eef'
});

couchpotatoClient.movie.getAll(function(e, r) {
	console.log(r);
});

console.log("End");