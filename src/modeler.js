const Sequelize = require('sequelize');
let db = require('./db');
let utils = require('./utils');

class Models {
  constructor() {
    this._models = {};
    this._stdFields = [
        { name: 'id', type: 'integer', autoIncrement: true },
        { name: 'created_at', type: 'date' },
        { name: 'updated_at', type: 'date' },
        { name: 'deleted_at', type: 'date' }
      ];
  }

  get models() {
    return this._models;
  }

  createModel(schema) {
		console.log(schema);
    if (!schema.name) {
      let err = new Error('schema name required');
      throw err;
    }
    let fields = JSON.parse(JSON.stringify(this._stdFields));
    if (schema.fields && schema.fields.length > 0) {
      fields = fields.concat(schema.fields);
    }
    let columns = {};
    fields.map(field => {
      let data = {};
      data.type = Sequelize[field.type.toUpperCase()];
      field.name === 'id' ? data.primaryKey = true : null;
			field.autoIncrement ? data.autoIncrement = true : null;
      columns[field.name] = data;
    });
    let options = {};
    options.underscored = true;
    options.freezeTableName = true;
    let model = db.connection.define(schema.name, columns, options);
    this._models[schema.name] = model;
    db.connection.sync();
		console.log(`model for ${schema.name} has been created`);
    return { name: schema.name, fields: model.rawAttributes, associations: model.associations }
  }

	generateModels() {
		let schemas = utils.tableConfig;
		for (let name in schemas) {
			this.createModel(schemas[name]);
		}
	}
}

let instance = null;
if (!instance) {
  instance = new Models();
}

module.exports = instance;
