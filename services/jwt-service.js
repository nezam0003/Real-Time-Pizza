const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

class JwtService {
  static sign(payload, secret = JWT_SECRET, expiry = "1d") {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }
}

module.exports = JwtService;
