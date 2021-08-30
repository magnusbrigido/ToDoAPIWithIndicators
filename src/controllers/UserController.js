const { validationResult } = require("express-validator");

const User = require("../models/User");

module.exports = {
  async create(request, response) {
    const { name, email, password } = request.body;

    const errors = validationResult(request).array();

    if(errors.length > 0) {
      return response.status(400).json({ error: errors[0].msg });
    }

    const userAlreadyExists = await User.findOne({
      where: {
        email
      }
    });

    if(userAlreadyExists) return response.status(400).json({ error: "User already exists" });

    const user = await User.create({
      name,
      email,
      password
    });

    return response.status(201).json(user);
  },

  async list(request, response) {
    const users = await User.findAll();

    return response.json(users);
  },

  async listById(request, response) {
    const { id } = request.params;

    const user = await User.findByPk(id, {
      include: {
        association: "tasks"
      }
    });

    return response.json(user);
  },

  async edit(request, response) {
    const { name, email, password, isAdmin } = request.body;
    const { id } = request.params;

    const user = await User.findByPk(id);

    if(!user) {
      return response.status(400).json({ error: "User does not exist" });
    }

    await User.update({
      name,
      email,
      password,
      isAdmin
    },{
      where: {
        id: user.id
      }
    });

    return response.status(204).send();
  },

  async delete(request, response) {
    const { id } = request.params;

    const user = await User.findByPk(id);

    if(!user) {
      return response.status(400).json({ error: "User does not exist" });
    }

    await User.destroy({
      where: {
        id: user.id
      }
    });

    return response.status(204).send();
  }
}