let Sequelize = require("sequelize");

let utils = require("./utils");
let mappers = require("./mappers");

class Db {
  constructor() {
    this._connectionSetting = null;
    this._connection = null;
  }

  get connection() {
    return this._connection;
  }

  async setConnection(db) {
    try {
      this._connectionSetting = db;
      this._connection = new Sequelize(db.name, db.user, db.password, {
        host: db.host,
        dialect: db.dialect,
        port: db.port
      });
      await this._createUUIDextension();
      console.log(`uuid extension has been created`);
    } catch (err) {
      throw(err);
    }
  }

  async _createUUIDextension() {
    try {
      if (this._connectionSetting.dialect === "postgres") {
        let raw = `create extension if not exists "uuid-ossp"`;
        await this.connection.query(raw);
      }
    } catch (err) {
      throw err;
    }
  }

  async testConnection() {
    try {
      await this._connection.authenticate();
      console.log(`Connected to database`);
      return {
        message: `Connection to ${
          this._connectionSetting.name
        } has been successfully established`
      };
    } catch (err) {
      console.log(`Error connecting to ${this._connectionSetting.name}`);
      throw err;
    }
  }

  async getTables() {
    try {
      let dialect = this._connectionSetting.dialect;
      let raw = mappers.query[dialect].getTables;
      let tables = await this._connection.query(raw);
      return { data: tables };
    } catch (err) {
      throw err;
    }
  }

  async getColumns(tableName) {
    try {
      let dialect = this._connectionSetting.dialect;
      let raw = mappers.query[dialect].getFields(tableName);
      let fields = await this._connection.query(raw);
      return { data: fields };
    } catch (err) {
      throw err;
    }
  }

  async syncTables(config) {
    try {
      await utils.saveTableConfig(config);
      return { data: config };
    } catch (err) {
      throw err;
    }
  }
}

let instance = null;
if (!instance) {
  instance = new Db();
}

module.exports = instance;
