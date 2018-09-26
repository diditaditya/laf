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

  getData(tableName) {
    return async (req, res, next) => {
      try {
        let data = await this._getData(tableName, req.query);
        res.send({ data });
      } catch (err) {
        next(err);
      }
    };
  }

  postData(tableName) {
    return async (req, res, next) => {
      try {
        let created = await this._postData(tableName, req.body);
        res.send({ data: created });
      } catch (err) {
        next(err);
      }
    };
  }

  updateData(tableName) {
    return async (req, res, next) => {
      try {
        let updated = await this._updateData(
          tableName,
          req.params.id,
          req.body
        );
        res.send({ data: updated });
      } catch (err) {
        next(err);
      }
    };
  }

  deleteData(tableName) {
    return async (req, res, next) => {
      try {
        let deleted = await this._deleteData(tableName, req.params.id);
        res.send({ data: deleted });
      } catch (err) {
        next(err);
      }
    };
  }

  createStandardControllers(tableName) {
    return {
      getData: { method: "get", main: this.getData(tableName), options: {} },
      postData: { method: "post", main: this.postData(tableName), options: {} },
      updateData: {
        method: "put",
        main: this.updateData(tableName),
        options: {}
      },
      deleteData: {
        method: "delete",
        main: this.deleteData(tableName),
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
