const { parse } = require('url');

module.exports = function expresso() {
  const middlewares = [];

  const app = function app(req, res) {

    // Extract URL and method
    const { url, method } = req;
    const { pathname } = parse(url);

    // Find the Middleware
    let index = -1;
    for (let i = 0; i < middlewares.length; i += 1) {
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
      
      md.callback(req, res);
    }
  };

  app.get = (route, callback) => app.register(route, callback, 'GET');  
  app.put = (route, callback) => app.register(route, callback, 'PUT');
  app.post = (route, callback) => app.register(route, callback, 'POST');
  app.delete = (route, callback) => app.register(route, callback, 'DELETE');
  
  app.useHttp(route, callback, method) => {
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
