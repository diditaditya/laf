const express = require('express');
const bodyParser = require('body-parser');

const router = require('./router');

class App {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }

  addRoute(path, method, main, options={}) {
    let middlewares = [];
    if (options.auth) {
      middlewares = middlewares.concat(options.auth);
    }
    if (options.beforecall) {
      middlewares = middlewares.concate(options.beforecall);
    }
    let aftercall = [];
    if (options.aftercall) {
      aftercall = aftercall.concat(options.aftercall);
    }
    this.app[method](path, ...[...middlewares, main, ...aftercall]);
  }

  addRoutes() {
		let allRoutes = router.routes;
    for (let name in allRoutes) {
			let route = allRoutes[name];
			this.addRoute(route.path, route.method, route.main, route.options);
    }
  }
  
  addErrorHandler(handler) {
    this.app.use(handler);
  }
  
  start(port=3000) {
    this.app.listen(port, () => console.log(`listening to port ${port}`));
  }
}

let instance = null;
if (!instance) {
  instance = new App();
}

module.exports = instance;
