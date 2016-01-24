var request = require("superagent");

module.exports = function(app) {
  var api     = {};
  var methods = "get,head,post,put,patch,delete".split(",");

  for (var i=methods.length; i--;) {
    api[methods[i]] = (function(method) {
      return function(path, params, headers) {
        return double_call(app, method, path, params, headers);
      };
    })(methods[i]);
  }

  return api;
};

/**
 * Makes the call to the app with specified params
 *
 * @param {Object} express/connect app
 * @param {String} HTTP method name
 * @param {String} path
 * @param {Object|String} body or query params
 * @param {Object} request headers
 * @return {Promives} response
 */
function double_call(app, method, path, params, headers) {
  return new Promise(function(resolve, reject) {
    var url = find_app_url(app);
    var req = build_request(method, url + path, params, headers);

    req.end(function(err, res) {
      if (err) {
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
 * @param {Object} express|connect app
 * @return {String} base url
 */
function find_app_url(app) {

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
