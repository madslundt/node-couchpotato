var http = require('http')

module.exports = function(config) {

    var host = config.host,
        key = config.key

    this.Movie = {
        add: function(imdb_id, callback) {
            get(host + '/api?apikey=' + key + '/movie.add/?identifier=' + imdb_id, function(e, r) {
                (e ? callback(e, null) : callback(null, r));
            })
        },

        remove: function(imdb_id, callback) {
            get(host + '/api?apikey=' + key + '/movie.delete/?id=' + imdb_id + '&delete_from=wanted', function(e, r) {
                (e ? callback(e, null) : callback(null, r));
            })
        },

        getAll: function(callback) {
            get(host + 'api?apikey=' + key + '/movie.list/?status=active', function(e, r) {
                (e ? callback(e, null) : callback(null, r));
            })
        },

        get: function(imdb_id, callback) {
            get(host + 'api?apikey=' + key + '/movie.get/?id=' + imdb_id, function(e, r) {
                (e ? callback(e, null) : callback(null, r));
            })
        },

        refresh: function(imdb_id, callback) {
            get(host + 'api?apikey=' + key + '/movie.list/?id=' + imdb_id, function(e, r) {
                (e ? callback(e, null) : callback(null, r));
            })
        }
    }

    this.Options = {
        update: function(callback) {
            get(host + 'api?apikey=' + key + '/updater.check', function(e, r) {
                (e ? callback(e, null) : callback(null, r));
            })
        },

        status: function(callback) {
            get(host + 'api?apikey=' + key + '/app.available', function(e, r) {
                (e ? callback(e, null) : callback(null, r));
            })
        }

        version: function(callback) {
            get(host + 'api?apikey=' + key + '/app.version', function(e, r) {
                (e ? callback(e, null) : callback(null, r));
            })
        }
    }
    
    function get(url, callback){
        var response = ''
        var req = http.request(url, function(res){
                res.setEncoding('utf8')
                res.on('data', function(chunk){
                        response += chunk
                })
                res.on('end', function(){
                        callback(null, JSON.parse(response))
                })
        })
        req.on('error', function(e){
                callback(e, null)
        })
        req.end()
    }
}