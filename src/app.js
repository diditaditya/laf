const express = require("express");
const bodyParser = require("body-parser");

const router = require("./router");

class App {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this._config = {};
    this._tableConfig = {};
    this._defaultTables = [];
  }

  get config() {
    return this._config;
  }

  get tableConfig() {
    return this._tableConfig;
  }

  get defaultTables() {
    return this._defaultTables;
  }

  set config(conf) {
    this._config = conf;
  }

  set tableConfig(conf) {
    this._tableConfig = conf;
  }

  set defaultTables(tables) {
    this._defaultTables = tables;
  }

  addRoute(path, method, main, options = {}) {
    let beforemain = [];
    if (options.auth) {
      beforemain = beforemain.concat(options.auth);
    }
    if (options.beforemain) {
      beforemain = beforemain.concat(options.beforemain);
    }
    let aftermain = [];
    if (options.aftermain) {
      aftercall = aftercall.concat(options.aftermain);
    }
    this.app[method](path, ...[...beforemain, main, ...aftermain]);
  }

  addRoutes() {
    let allRoutes = router.routes;
    for (let name in allRoutes) {
      console.log(`adding ${name} route..`);
      let route = allRoutes[name];
      this.addRoute(route.path, route.method, route.main, route.options);
    }
  }

  addErrorHandler(handler) {
    this.app.use(handler);
  }

  start(port = 3000) {
    this.app.listen(port, () => console.log(`listening to port ${port}`));
  }
}

let instance = null;
if (!instance) {
  instance = new App();
}

module.exports = instance;
