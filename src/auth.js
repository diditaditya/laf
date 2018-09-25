const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const secret = 'secret';

class Auth {
  async hashPassword(plain) {
    try {
      let hashed = await argon2.hash(plain);
    } catch (err) {
      throw err;
    }
  }

  async verifyPassword(hashed, plain) {
    try {
      let matched = await argon2.verify(hashed, plain);
      if (matched) {
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }

  signToken(data) {
    return jwt.sign(data, secret);
  }
  
  verifyToken(token) {
    return jwt.verify(token, secret);
  }
}

let instance = null;
if (!instance) {
  instance = new Auth();
}

module.exports = instance;
