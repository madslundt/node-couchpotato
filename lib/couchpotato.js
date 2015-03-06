var request = require('request');
var qs      = require('querystring');
var q       = require('q');

var CouchPotatoMovie = require('./couchpotato-movie');

var CouchPotato = function(config) {
    this.apikey = config.apikey;
    this.url = config.url;
    this.key = null;

    this.debug = config.debug === true;

    this.movie = new CouchPotatoMovie(this);
};

CouchPotato.prototype.cmd = function(command, args) {
    var url = this.url + "/api/" + this.apikey + "/" + command + "/";

    if (typeof args == "function") {
        callback = args;
    } else {
        url += "?" + qs.stringify(args);
    }
    var defer = q.defer();

    function callback(error, response, body) {
        if (!response || response.statusCode != 200) {
            defer.reject(new Error("Status code did not return 200"));
        } else if (error) {
            defer.reject(error);
        }
        else if (response.statusCode == 200 && !error && body) {
            try {
                body = JSON.parse(body);
            } catch(err) {
                // No need to do anything - object is already json
            }
            defer.resolve(body);
        } else {
            defer.reject(new Error("Body did not contain data"));
        }
    }

    request({
        "uri": url,
        "json": true
    }, callback);

    return defer.promise;
};

CouchPotato.prototype.available = function() {
    return this.cmd('app.available').then(function(r) {
        return r.success;
    });
};

CouchPotato.prototype.restart = function() {
    return this.cmd('app.restart').then(function(r) {
        return r;
    });
};

CouchPotato.prototype.shutdown = function() {
    return this.cmd('app.shutdown').then(function(r) {
        return r;
    });
};

CouchPotato.prototype.version = function() {
    return this.cmd('app.version').then(function(r) {
        return r.version;
    });
};

CouchPotato.prototype.search = function(query) {
    return this.cmd('search', {q: query}).then(function(r) {
        return r.movies;
    });
};

module.exports = CouchPotato;