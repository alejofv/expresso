module.exports = {
  send(content) {
    this.write(content);
    this.end();
  },

  json(payload) {
    this.setHeader('Content-Type', 'application/json');
    this.write(JSON.stringify(payload));
    this.end();
  },
  
  status(code) {
    this.statusCode = code;
    return this;
  },
};
