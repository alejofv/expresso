const express = require('./expresso');

const app = express();

app.use((req, res, next) => {
  req.userId = 100;
  next();
});

app.get('/', (req, res) => {
  const { userId } = req;
  res.json({
    message: 'Welcome to the API',
    userId,
  });
});

app.use((req, res) => {
  res.statusCode = 404;
  res.json({
    message: 'Not found',
  });
});

module.exports = app;
