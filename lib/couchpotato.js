var http = require('http');

module.exports = function(config) {

    var host = config.host,
        key = config.key;

    this.movie = {

        /**
         * Add movie to couchpotato wanted list.
         * @param {movie imdb id}   imdb_id
         */
        add: function(imdb_id, callback) {
            get(host + '/api/' + key + '/movie.add/?identifier=' + imdb_id, function(e, r) {
                if (e)
                    callback(e, null);
                else
                    callback(null, r);
            });
        },

        /**
         * Remove movie from couchpotato wanted list.
         * @param {movie imdb id}   imdb_id
         */
        remove: function(imdb_id, callback) {
            get(host + '/api/' + key + '/movie.delete/?id=' + imdb_id + '&delete_from=wanted', function(e, r) {
                if (e)
                    callback(e, null);
                else
                    callback(null, r);
            });
        },

        /**
         * Get all movies from couchpotato wanted list.
         */
        getAll: function(callback) {
            get(host + '/api/' + key + '/movie.list/?status=active', function(e, r) {
                if (e)
                    callback(e, null);
                else
                    callback(null, r);
            });
        },

        /**
         * Get a single movie from couchpotato wanted list.
         * @param {movie imdb id}   imdb_id
         */
        get: function(imdb_id, callback) {
            get(host + '/api/' + key + '/movie.get/?id=' + imdb_id, function(e, r) {
                if (e)
                    callback(e, null);
                else
                    callback(null, r);
            });
        },

        /**
         * Refresh a single movie on couchpotato wanted list.
         * @param {movie imdb id}   imdb_id
         */
        refresh: function(imdb_id, callback) {
            get(host + '/api/' + key + '/movie.list/?id=' + imdb_id, function(e, r) {
                if (e)
                    callback(e, null);
                else
                    callback(null, r);
            });
        }
    },

    this.option = {

        /**
         * Check if couchpotato needs to be updated.
         */
        update: function(callback) {
            get(host + '/api/' + key + '/updater.check', function(e, r) {
                if (e)
                    callback(e, null);
                else
                    callback(null, r);
            });
        },

        /**
         * Gets the availability of couchpotato.
         */
        status: function(callback) {
            get(host + '/api/' + key + '/app.available', function(e, r) {
                if (e)
                    callback(e, null);
                else
                    callback(null, r);
            });
        },

        /**
         * Gets the current version of couchpotato.
         */
        version: function(callback) {
            get(host + '/api/' + key + '/app.version', function(e, r) {
                if (e)
                    callback(e, null);
                else
                    callback(null, r);
            });
        }
    }


    /**
     * Contructor checks if CouchPotato is online else throws an exception.
     */
    this.option.status(function(e, r) {
        if (e !== null)
            throw new Exception();
    })
    
    /**
     * Download content from url and parse to JSON.
     * @param  {url}   url
     */
    function get(url, callback) {
        var response = '';
        var req = http.request(url, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                    response += chunk;
            });
            res.on('end', function() {
                    callback(null, JSON.parse(response));
            });
        });
        req.on('error', function(e){
            callback(e, null);
        });
        req.end();
    }
}