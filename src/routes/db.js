let db = require('../db');
let modeler = require('../modeler');

module.exports = {
	testConnection: {
		path: '/test',
		method: 'get',
		main: async (req, res, next) => {
			try {
				let result = await db.testConnection();
				res.send(result);
			} catch (err) {
				console.log(err);
				next(err);
			}
		}
	},
	getTables: {
		path: '/tables',
		method: 'get',
		main: async (req, res, next) => {
			try {
				let data = await db.getTables();
				res.send(data);
			} catch (err) {
				next(err);
			}
		}
	},
	getFields: {
		path: '/columns/:tableName',
		method: 'get',
		main: async (req, res, next) => {
			try {
				let data = await db.getColumns(req.params.tableName);
				res.send(data);
			} catch (err) {
				next(err);
			}
		}
	},
	createTable: {
		path: '/createtable',
		method: 'post',
		main: async (req, res, next) => {
			try {
				let newModel = modeler.createModel(req.body);
				let data = await db.syncTables(req.body);
				res.send(data);
			} catch (err) {
				next(err);
			}
		}
	}
}
