const fs = require('fs');

class Routils {
  constructor() {
    this._middlewaresPath = `${__dirname}/middlewares`;
  }

  readMiddlewares() {
    console.log('reading middlewares..');
    let files = fs.readdirSync(this._middlewaresPath);
    let middlewares = {};
    for (let file of files) {
      if (/\.js/.test(file)) {
        let mw = require(`${this._middlewaresPath}/${file}`);
        let name = file.replace(".js", "");
        middlewares[name] = mw;
      }
    }
    return middlewares;
  }

  parseSelect(select) {
    console.log('select', select);
    return null
  }
}

let instance = null;
if (!instance) {
  instance = new Routils();
}

module.exports = instance;
