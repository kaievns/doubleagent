var http    = require("http");
var https   = require("https");
var request = require("superagent");

module.exports = function(app) {
  var api     = {};
  var methods = "get,head,post,put,patch,delete".split(",");
  var server  = http.createServer(app);

  for (var i=methods.length; i--;) {
    api[methods[i]] = (function(method) {
      return function(path, params, headers) {
        return double_call(server, method, path, params, headers);
      };
    })(methods[i]);
  }

  api.server = server;
  api.app    = app;

  return api;
};

/**
 * Makes the call to the app with specified params
 *
 * @param {Object} http server
 * @param {String} HTTP method name
 * @param {String} path
 * @param {Object|String} body or query params
 * @param {Object} request headers
 * @return {Promives} response
 */
function double_call(server, method, path, params, headers) {
  return new Promise(function(resolve, reject) {
    var url = find_app_url(server);
    var req = build_request(method, url + path, params, headers);

    req.end(function(err, res) {
      server.close();

      if (err && (!res || err.status !== res.status)) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

/**
 * Binds the app to a http port and returns the
 * base url thing
 *
 * @param {Object} http server
 * @return {String} base url
 */
function find_app_url(server) {
  !server.address() && server.listen(0);

  var port     = server.address().port;
  var protocol = server instanceof https.Server ? 'https' : 'http';

  return protocol + '://127.0.0.1:' + port;
}

/**
 * Builds the superagent request instance
 *
 * @param {String} method
 * @param {String} location
 * @param {Object} extra params (body for POSTs and query fro GETs)
 * @param {Object} extra headers
 * @return {Object} superagent request
 */
function build_request(method, url, params, headers) {
  var req = request[method](url);

  if (params) {
    if (method === "get" || method === "head") {
      req = req.query(params);
    } else {
      req = req.send(params);
    }
  }

  if (headers) {
    for (var key in headers) {
      req = req.set(key, headers[key]);
    }
  }

  return req;
}
