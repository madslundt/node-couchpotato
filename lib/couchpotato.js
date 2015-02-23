var request = require("request");
var qs = require('querystring');

var CouchPotatoMovie = require('./couchpotato-movie');

var CouchPotato = function(config) {
    this.username = config.username;
    this.password = config.password;
    this.url = config.url;
    this.key = null;

    this.debug = config.debug === true;

    this.movie = new CouchPotatoMovie(this);
};

CouchPotato.prototype.getKey = function(callback) {
    if (this.key)
        return this.key;

    if (typeof callback != "function") {
        return this.key;
    }

    var context = this;
    request({
        "uri": this.url + "/getkey/?p=" + this.password + "&u=" + this.username,
        "json": true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body.success) {
                context.key = body.api_key;
                context.loadStatusList(callback);
            }
        } else {
            callback(false);
        }
    });
};

CouchPotato.prototype.cmd = function(command, args) {
    var url = this.url + "/api/" + this.getKey() + "/" + method + "/";
    var callback = _callback;

    if (typeof parameters == "function") {
        callback = parameters;
    } else {
        url += "?" + qs.stringify(parameters);
    }

    request({
        "uri": url,
        "json": true
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(true, body);
        } else if (response.statusCode == 404) {
            callback(false);
            console.log("ERROR: Invalid API key");
        } else {
            console.log("ERROR ", response.statusCode, error);
            callback(false);
        }
    });
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

module.exports = CouchPotato;