const fs = require("fs");

let app = require("./app");

class Utils {
  constructor() {
    this._configPath = `${__dirname}/config`;
    this._tableConfigPath = `${this._configPath}/tables`;
    this._defaultTablePath = `${this._tableConfigPath}/default`;
  }

  _readDir(path) {
    let files = fs.readdirSync(path);
    let tableConfig = {};
    for (let file of files) {
      if (/\.json$/.test(file)) {
        let config = JSON.parse(fs.readFileSync(`${path}/${file}`));
        tableConfig[config.name] = config;
      }
    }
    return tableConfig;
  }

  readConfigFile() {
    let file = "config.json";
    let config = JSON.parse(fs.readFileSync(`${this._configPath}/${file}`));
    app.config = config;
    return config;
  }

  readDefaultTables() {
    let tableConfig = this._readDir(this._defaultTablePath);
    app.defaultTables = Object.keys(tableConfig);
    app.tableConfig = tableConfig;
    return tableConfig;
  }

  readTableDir(opt = { firstRun: true }) {
    let tableConfig = this._readDir(this._tableConfigPath);
    if (opt.firstRun) {
      app.tableConfig = Object.assign(app.tableConfig, tableConfig);
    }
    return tableConfig;
  }

  saveTableConfig(config) {
    try {
      let name = config.name || "";
      name = `${name}${Date.now()}.json`;
      let path = `${this._tableConfigPath}/${name}`;
      let text = JSON.stringify(config);
      fs.writeFileSync(path, text);
      let message = `Successfully created ${path}`;
      console.log(message);
      return { message };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

let instance = null;
if (!instance) {
  instance = new Utils();
}

module.exports = instance;
