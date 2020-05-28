var http    = require("http");
var https   = require("https");
var request = require("superagent");

module.exports = function(app) {
  var api     = {};
  var methods = "get,head,post,put,patch,delete".split(",");
  var server  = http.createServer(app);

  for (var i=methods.length; i--;) {
    api[methods[i]] = (function(method) {
      return function(path, params, headers, files) {
        var combined_headers = Object.assign({}, api.defaultHeaders, headers);
        return double_call(server, method, path, params, combined_headers, files);
      };
    })(methods[i]);
  }

  api.server = server;
  api.app    = app;
  api.urlFor = function(path) {
    return find_app_url(server) + path;
  };

  return api;
};

/**
 * Makes the call to the app with specified params
 *
 * @param {Object} http server
 * @param {string} HTTP method name
 * @param {string} path
 * @param {Object|string} body or query params
 * @param {Object} request headers
 * @param {Object} file uploads
 * @return {Promise<response>} response
 */
function double_call(server, method, path, params, headers, files) {
  return new Promise(function(resolve, reject) {
    var url = find_app_url(server);
    var req = build_request(method, url + path, params, headers, files);

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
 * @return {string} base url
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
 * @param {string} method
 * @param {string} location
 * @param {Object} extra params (body for POSTs and query for GETs)
 * @param {Object} extra headers
 * @param {Object} file uploads
 * @return {Object} superagent request
 */
function build_request(method, url, params, headers, files) {
  var req = request[method](url);

  if (params) {
    if (files) {
      for (const param in params) {
        req = req.field(param, params[param]);
      }
    } else if (method === "get" || method === "head") {
      req = req.query(params);
    } else {
      req = req.send(params);
    }
  }

  if (files) {
    for (const file in files) {
      req = req.attach(file, files[file]);
    }
  }

  if (headers) {
    for (var key in headers) {
      req = req.set(key, headers[key]);
    }
  }

  return req;
}
