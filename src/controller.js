let routils = require("./routils");
let modeler = require("./modeler");
let models = modeler.models;

class Controller {
  async _getData(tableName, query) {
    try {
      routils.parseSelect(query.select);
      let model = models[tableName];
      let data = await model.findAll();
      return data;
    } catch (err) {
      throw err;
    }
  }

  async _postData(tableName, data) {
    try {
      let model = models[tableName];
      let created = await model.create(data);
      return created;
    } catch (err) {
      throw err;
    }
  }

  async _updateData(tableName, id, data) {
    try {
      let model = models[tableName];
      let where = { id };
      let updated = await model.update(data, { where });
      return updated;
    } catch (err) {
      throw err;
    }
  }

  async _deleteData(tableName, id) {
    try {
      let model = models[tableName];
      let deleted = await model.destroy({ where: { id } });
      return deleted;
    } catch (err) {
      throw err;
    }
  }

  getData() {
    return async (req, res, next) => {
      try {
        let data = await this._getData(
          req.params.tableName,
          req.query
        );
        res.send({ data });
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  postData() {
    return async (req, res, next) => {
      try {
        let created = await this._postData(
          req.params.tableName,
          req.body
        );
        res.send({ data: created });
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  updateData() {
    return async (req, res, next) => {
      try {
        let updated = await this._updateData(
          req.params.tableName,
          req.params.id,
          req.body
        );
        res.send({ data: updated });
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  deleteData() {
    return async (req, res, next) => {
      try {
        let deleted = await this._deleteData(
          req.params.tableName,
          req.params.id
        );
        res.send({ data: deleted });
        next();
      } catch (err) {
        next(err);
      }
    };
  }

  createStandardControllers() {
    return {
      getData: { method: "get", main: this.getData(), options: {} },
      postData: { method: "post", main: this.postData(), options: {} },
      updateData: {
        method: "put",
        main: this.updateData(),
        options: {}
      },
      deleteData: {
        method: "delete",
        main: this.deleteData(),
        options: {}
      }
    };
  }
}

let instance = null;
if (!instance) {
  instance = new Controller();
}

module.exports = instance;
