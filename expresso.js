const { parse } = require('url');
const { send, json, status } = require('./response') 

module.exports = function expresso() {
  const middlewares = [];

  const app = function next(req, res, start = 0) {
    res.send = send;
    res.json = json;
    res.status = status;

    // Extract URL and method
    const { url, method } = req;
    const { pathname } = parse(url);

    // Find the Middleware
    let index = -1;
    for (let i = start; i < middlewares.length; i += 1) {
      if (middlewares[i].route) {
        if (middlewares[i].route === pathname && middlewares[i].method === method) {
          index = i;
          break;
        }
      } else {
        index = i;
        break;
      }
    }

    // Execute callback
    if (index === -1) {
      res.statusCode = 500;
      res.end('No matching middleware found');
    } else {
      const md = middlewares[index];
      md.callback(req, res, () => {
        next(req, res, index + 1);
      });
    }
  };

  app.get = (route, callback) => app.useHttp(route, callback, 'GET');  
  app.put = (route, callback) => app.useHttp(route, callback, 'PUT');
  app.post = (route, callback) => app.useHttp(route, callback, 'POST');
  app.delete = (route, callback) => app.useHttp(route, callback, 'DELETE');

  app.useHttp = (route, callback, method) => {
    middlewares.push({
      route,
      callback,
      method,
    });
  };

  app.use = (callback) => {
    middlewares.push({
      callback,
    });
  };

  return app;
};
