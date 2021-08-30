const { verify } = require("jsonwebtoken");
const { secretToken } = require("../config/auth");

module.exports = function(request, response, next) {
    const authToken = request.headers.authorization;

    if(!authToken) {
      return response.status(401).json({ error: "Invalid Token"})
    }

    const [, token] = authToken.split(' ');

    try {
      const { sub } = verify(token, secretToken);

      request.userId = sub;

      next();
    } catch(err) {
      return response.status(400).json(err.message);
    }
  }
