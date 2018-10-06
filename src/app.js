const express = require("express");
const bodyParser = require("body-parser");
const async = require("async");

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

  _chain(options, pos) {
    let chain = [];
    if (pos === 'before') {
      if (options.auth) {
        chain = chain.concat(options.auth);
      }
      if (options.beforemain) {
        chain = chain.concat(options.beforemain);
      }
    } else if (pos === 'after') {
      let aftermain = options.aftermain ? options.aftermain : [];
      chain = [...aftermain, this._midEnder()];
    } else {
      throw(new Error('chain position must be before or after'));
    }
    return chain;
  }

  _midEnder() {
    return (req, res, next) => {}
  }

  _before() {
    return (req, res, next) => {
      let middlewares = router.middlewares;
      let tableName = req.params.tableName;
      let method = req.method.toLowerCase();
      let chain = [];
      if (middlewares[tableName]) {
        if (middlewares[tableName][method]) {
          let options = middlewares[tableName][method];
          chain = this._chain(options, 'before');
        }
      } else if (middlewares.all) {
        if (middlewares.all[method]) {
          let options = middlewares.all[method];
          chain = this._chain(options, 'before');
        }
      }
      if (chain.length > 0) {
        chain = chain.map(fn => fn.bind(null, req, res, next));
        async.series(chain, err => {
          if (err) {
            return next(err);
          }
          next();
        });
      } else {
        next();
      }
    }
  }
  
  _after() {
    return (req, res, next) => {
      let middlewares = router.middlewares;
      let tableName = req.params.tableName;
      let method = req.method.toLowerCase();
      let chain = [];
      if (middlewares[tableName]) {
        if (middlewares[tableName][method]) {
          let options = middlewares[tableName][method];
          chain = this._chain(options, 'after');
        }
      } else if (middlewares.all) {
        if (middlewares.all[method]) {
          let options = middlewares.all[method];
          chain = this._chain(options, 'after');
        }
      }
      if (chain.length > 0) {
        chain = chain.map(fn => fn.bind(null, req, res));
        async.series(chain, err => {
          if (err) {
            return next(err);
          }
          next();
        });
      } else {
        next();
      }
    }
  }

  addRoute(path, method, main) {
    this.app[method](path, this._before(), main, this._after());
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
