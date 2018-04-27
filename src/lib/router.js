'use strict';

const logger = require('./logger');
const bodyParser = require('./body-parser');
const urlParser = require('./url-parser');
const response = require('../lib/response');

const Router = module.exports = function router() {
  this.routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
  };
};

Router.prototype.get = function get(endpoint, callback) {
  // debug(`Router: GET ${endpoint} mounted)
  this.routes.GET[endpoint] = callback;
};

Router.prototype.post = function post(endpoint, callback) {
  this.routes.POST[endpoint] = callback;
};

Router.prototype.put = function put(endpoint, callback) {
  this.routes.PUT[endpoint] = callback;
};

Router.prototype.delete = function remove(endpoint, callback) {
  this.routes.DELETE[endpoint] = callback;
};

// return a promise.all these need to be wrapped in promises...
Router.prototype.route = function route() {
  return (req, res) => {
    // bodyParser(req)
    // .then(body => {
    //   console.log(body, 'this time its going to work!')
    // })
    Promise.all([
      urlParser(req), // middleware
      bodyParser(req), // middleware
    ])
      .then(() => { 
      if (typeof this.routes[req.method][req.url.pathname] === 'function') {
        this.routes[req.method][req.url.pathname](req, res);
        return; 
      }
      // res.writeHead(404, { 'Content-Type': 'text/plain' });
      // res.write('Route Not Found FROM HERE');
      // res.end();
  })
  .catch((err) => {
    if (err instanceof SyntaxError) {
    //   res.writeHead(404, { 'Content-Type': 'test/plain' });
    //   res.write('Route Not Found');
    //   res.end();
    //   return undefined;
    // }

    response.sendText(res, 404, 'Route Not Found');
    return undefined;

    logger.log(logger.ERROR, JSON.stringify(err));
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('Bad Request');
    res.end();
    return undefined;
  });
  };
};