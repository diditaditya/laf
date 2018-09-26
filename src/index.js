let app = require("./app");
let db = require("./db");
let modeler = require("./modeler");
let router = require("./router");
let utils = require("./utils");

// db connection config
let dbConfig = {
  name: "laf",
  host: "laf-db",
  user: "laf",
  password: "laf",
  dialect: "postgres",
  port: 5432
};

let startServer = async () => {
  try {
    console.log("creating database connection..");
    await db.setConnection(dbConfig);
    
    console.log("reading table configs..");
    utils.readDefaultTables();
    utils.readTableDir();
    
    console.log("generating models...");
    modeler.generateModels();
    
    console.log("generating routes..");
    router.createStandardRoutes();
    router.createCustomRoutes();
    
    console.log("adding routes to server..");
    app.addRoutes();
    
    // welcome
    app.addRoute("/", "get", (req, res) =>
      res.send("lazy fox jumps over the brown dog")
    );
    
    // error handler
    app.addErrorHandler((err, req, res, next) => {
      let message = err.message || "internal server error";
      res.status(500).send({ message });
    });
    
    app.start();

  } catch (err) {
    throw(err);
  }
}

startServer();
