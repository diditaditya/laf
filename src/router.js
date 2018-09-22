let app = require('./app');
let controller = require('./controller');

let customRoutes = require('./routes');

class Routes {
  constructor() {
    this._routes = {};
  }

  get routes() {
    return this._routes;
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
      Object.keys(controls).map(act => {
				let path = `/${name}`;
        let idRequired = controls[act].method === 'put' || controls[act].method === 'delete';
        path = idRequired ? `${path}/:id` : path;
        this._routes[`${name}_${act}`] = { path, method: controls[act].method, main: controls[act].main, options: controls[act].options }
			});
    }
	}
}

let instance = null;
if (!instance) {
  instance = new Routes();
}

module.exports = instance;
