const url = require('url');
const http = require('http');
const path = require('path');
const Request = require('./request');
const Response = require('./response');
const { parse } = require('path');

class app {
  constructor(options) {
    const isHttpsServer = options && options.key && options.cert ? true : false;
    this.server = isHttpsServer
      ? https.createServer(options)
      : http.createServer();

    this.server.on('connection', handleConnection);
    this.server.on('request', handleRequest);
    this.run.bind(run);
    this.get.bind(get);
    this.routes = [];
  }

  handleConnection() {
    console.log('connection made successfully');
  }

  run(port) {
    const port = port ? port : 3001;
    this.server.listen(port);
  }

  handleRequest(req, res) {
    this.request = Request(req);
    this.response = Response(res);
    //parse route
    parseRoute(req);

    //process request
    processRequest();
  }

  get = (route, callback) => {
    //create route object
    const routeObj = {
      route: route,
      callback: callback,
      method: 'get',
    };
    this.routes.push(routeObj);
  };

  parseRoute(request) {
    const route = request.url;
    this.request.method = request.method.toLowerCase();

    const host = request.headers.host;
    const urlTokenObject = new URL(route, `http://${host}`);

    const searchParams = {};

    for (const params of urlTokenObject.searchParams) {
      searchParams[params[0]] = params[1];
    }

    // todo : get params from url
    const routeParams = {};

    // add params to request
    this.request.params = { ...searchParams, ...routeParams };
  }

  processRequest() {
    for (routeObj in this.routes) {
      if (routeObj.method === this.request.method) {
        //check if given route is matching any routeObj
        if (this.request.method.includes(routeObj.route))
          routeObj.callback(this.request, this.response);
      }
    }
  }
}
