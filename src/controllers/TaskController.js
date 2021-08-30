const { validationResult } = require("express-validator");
const Task = require("../models/Task");

module.exports = {
  async create(request, response) {
    const { description } = request.body;
    const { userId } = request;

    const errors = validationResult(request).array();
    
    if(errors.length > 0) {
      return response.status(400).json({ error: errors[0].msg });
    }

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
  }
}