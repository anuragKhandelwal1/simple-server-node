const app = require('./router');

const simpleServer = (options) => {
  return new app(options);
};
module.exports = {
  server: simpleServer,
};
