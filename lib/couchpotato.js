(function() {
    var request = require('request');
    var URL     = require('url');
    var util    = require('util');
    var QS      = require('querystring');
    var Q       = require('q');

    var CouchPotatoMovie = require('./couchpotato-movie');

    var CouchPotato = function(config) {
        this.apikey = config.apikey;
        this.url = config.url;
        this.debug = config.debug === true;
        
        this.invalid = false;

        this.movie = new CouchPotatoMovie(this);

        this.available().then(function(r) {
            if (r === null) {
                util.log('CouchPotato available failed');
                return false;
            }
            if (debug)
                util.log('CouchPotato available: ' + r);
        }, function(error) {
            util.log('CouchPotato available failed: ' + error);
            this.invalid = true;
        });
    };

    CouchPotato.prototype.cmd = function(command, args) {
        if (this.invalid)
        {
            util.log('CouchPotato API invalid because of connection/API key issues');
            return false;
        }

        if (this.url[this.url.length] != '/')
            this.url += '/';

        // build url for request
        var url = this.url + 'api/' + this.apikey + '/' + command;

        // Extra parameters
        if (args)
            url += '?' + QS.stringify(args);

        if (this.debug)
            util.log("Retrieving url \'" + url + "\'");

        // perform request
        var defer = Q.defer();
        request.get(url, function(error, response, body) {
            if (!error && response.headers['content-type'].indexOf('application/json') != -1) {
                body = JSON.parse(body);
                defer.resolve(body);
            } else {
                this.invalid = true;
                if (error) {
                    util.log(error);
                    defer.reject(error);
                }
                util.log('Connection failed');
                return false;
            }
        });

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

    module.exports = CouchPotato;
})();