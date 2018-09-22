const fs = require('fs');

class Utils {
	constructor() {
		this._configPath = `${__dirname}/config`;
		this._tableConfigPath = `${this._configPath}/tables`;
		this._defaultTablePath = `${this._tableConfigPath}/default`;
		this._tableConfig = {};
		this._defaultTables = [];
	}

	get tableConfig() {
		return this._tableConfig;
	}

	set tableConfig(tableConfig) {
		this._tableConfig = tableConfig;
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

	readDefaultTables() {
		let tableConfig = this._readDir(this._defaultTablePath);
		this._defaultTables = Object.keys(tableConfig);
		this._tableConfig = tableConfig;
		return tableConfig;
	}
	
	readTableDir(opt={ firstRun: true }) {
		let tableConfig = this._readDir(this._tableConfigPath);
		if (opt.firstRun) {
			this._tableConfig = Object.assign(this._tableConfig, tableConfig);
		}
		return tableConfig;
	}

	saveTableConfig(config) {
		try {
			let name = config.name || '';
			name = `${name}${Date.now()}.json`;
			let path = `${this._tableConfigPath}/${name}`;
			let text = JSON.stringify(config);
			fs.writeFileSync(path, text);
			let message = `Successfully created ${path}`;
			console.log(message);
			return { message }
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
