let app = require("./app");
let controller = require("./controller");
let routils = require("./routils");

let customRoutes = require("./routes");

class Routes {
  constructor() {
    this._routes = {};
    this._middlewares = routils.readMiddlewares();
  }

  get routes() {
    return this._routes;
  }

  get middlewares() {
    return this._middlewares;
  }

  set middlewares(mw) {
    this._middlewares = mw;
  }

  createCustomRoutes() {
    for (let name in customRoutes) {
      this._routes[name] = customRoutes[name];
    }
  }

  _createMiddlewares(method) {
    return (req, res, next) => {
      let tableName = req.params.tableName;
      let mws = this._middlewares;
      if (mws.default) {
        if (mws.default.all) {
          return mws.default.all;
        }
        if (mws.default[method]) {

        }
      }
    }
  }

  createStandardRoutes() {

    let controls = controller.createStandardControllers();
    for (let act in controls) {
      let path = '/:tableName';
      let method = controls[act].method;
      let idRequired = method === "put" || method === "delete";
      path = idRequired ? `${path}/:id` : path;
      let options = controls[act].options;
      let mws = this._middlewares || null;
      if (mws) {
        if (mws.all) {
          options = mws.all;
        }
        if (mws[method]) {
          options = Object.assign(options, mws[method]);
        }
      }
      this._routes[act] = {
        path,
        method,
        main: controls[act].main,
        options
      }
    }
  }
}

let instance = null;
if (!instance) {
  instance = new Routes();
}

module.exports = instance;
