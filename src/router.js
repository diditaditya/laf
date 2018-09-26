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

  createStandardRoutes() {
    let tableConfig = app.tableConfig;
    for (let name in tableConfig) {
      let controls = controller.createStandardControllers(name);
      let std = { name, actions: [] };
      let mws = this._middlewares[name] || null;
      Object.keys(controls).map(act => {
        let path = `/${name}`;

        let method = controls[act].method;
        let idRequired = method === "put" || method === "delete";
        path = idRequired ? `${path}/:id` : path;

        let options = controls[act].options;
        if (mws) {
          if (mws.all) {
            options = mws.all;
          }
          if (mws[method])
          options = Object.assign(options, mws[method]);
        }

        this._routes[`${name}_${act}`] = {
          path,
          method,
          main: controls[act].main,
          options
        };
      });
    }
  }
}

let instance = null;
if (!instance) {
  instance = new Routes();
}

module.exports = instance;
