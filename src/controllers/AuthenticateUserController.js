const { sign } = require("jsonwebtoken");

const { secretToken, expiresIn } = require("../config/auth");
const User = require("../models/User");

module.exports = {
  async authenticate(request, response) {
    const { email, password } = request.body;

    const user = await User.findOne({
      where: {
        email
      }
    });

    if(!user) {
      return response.status(400).json({ error: "Incorrect e-mail/password" });
    }

    if(user.password != password) {
      return response.status(400).json({ error: "Incorrect e-mail/password" });
    }

    const token = sign({
      email: user.email
    }, secretToken, {
      subject: user.id,
      expiresIn
    });

    return response.json({ token });
  }
}