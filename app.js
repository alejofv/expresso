const express = require('./expresso');

const app = express();

app.get('/', (req, res) => res.end('Hello Express!'));

app.use((req, res) => {
  res.statusCode = 404;
  res.end('Not found');
});

module.exports = app;
