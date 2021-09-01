const { Op } = require("sequelize");

const Task = require("../models/Task");
const User = require("../models/User");

module.exports = {
  async create(request, response) {
    const { description } = request.body;
    const { userId } = request;

    const task = await Task.create({
      userId,
      description
    });

    return response.status(201).json(task);
  },

  async edit(request, response) {
    const { description, status } = request.body;
    const { id } = request.params;

    const enumStatus = status.toUpperCase();

    const checkEnumValue = Task.rawAttributes.status.values.find(
      value => value == enumStatus
    );

    if(!checkEnumValue) {
      return response.status(400).json({ error: "Invalid status"})
    }

    const task = await Task.findByPk(id);

    if(!task) {
      return response.status(400).json({ error: "Task does not exist"});
    }
    console.log(task.status, enumStatus);

    if(task.status === "CREATED" && enumStatus === "DONE"
      || task.status === "RUNNING" && enumStatus === "CREATED") {
      return response.status(400).json({ error: `Task can not change from ${task.status} to ${enumStatus}`});
    }

    if(enumStatus && task.status === "DONE") {
      return response.status(400).json({ error: "Task is already done"});
    }

    if(enumStatus === "RUNNING") task.runningDate = new Date();
    if(enumStatus === "DONE") task.doneDate = new Date();

    await Task.update({
      description,
      status,
      runningDate: task.runningDate,
      doneDate: task.doneDate
    }, {
      where: {
        id: task.id
      }
    });

    return response.status(204).send();
  },

  async list(request, response) {
    const { search, order } = request.query;
    let { orderBy } = request.query;

    orderBy = orderBy.split(".");

    const tasks = await Task.findAll({
      include: {
        association: "user",
        required: true,
        attributes: ["name"]
      },
      where: {
        [Op.or]: {
          description: {
            [Op.like]: `%${search}%`
          },
          status: search,
        },
      },
      order: [[...orderBy, order]]
    });

    return response.json(tasks)
  }
}