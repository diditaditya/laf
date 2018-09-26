const auth = require("../auth");

const register = async (req, res, next) => {
  try {
    let plain = req.body.password;
    req.body.password = await auth.hashPassword(plain);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  post: {
    beforemain: [ register ]
  }
}
