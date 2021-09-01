const { Op } = require("sequelize");

const Task = require("../models/Task");

module.exports = {
  async totalDoneTasks(request, response) {
    const { count } = await Task.findAndCountAll({
      where: {
        status: "done"
      }
    });

    return response.json(count);
  },

  async averageDoneTasks(request, response) {
    const { userId } = request.params;
    
    const allTasks = await Task.findAndCountAll({
      where: {
        userId
      }
    });

    const doneTasks = await Task.findAndCountAll({
      where: {
        userId,
        status: "DONE"
      }
    });

    const average = (doneTasks.count/allTasks.count).toFixed(2);

    return response.json(average);
  },

  async timeAverageCreatedToRunning(request, response) {
    const { userId } = request.params;

    const runningTasks = await Task.findAndCountAll({
      where: {
        userId,
        status: "RUNNING"
      }
    });

    const doneTasks = await Task.findAndCountAll({
      where: {
        userId,
        status: "DONE"
      }
    });

    let sum = 0;
   
    runningTasks.rows.map(task => sum += task.dataValues.runningDate - task.dataValues.createdAt);
    doneTasks.rows.map(task => sum += task.dataValues.runningDate - task.dataValues.createdAt);
    
    const average = sum/(runningTasks.count + doneTasks.count);

    if(!average) {
      return response.json(0);
    }
  
    return response.json(average);
  },

  async timeAverageRunningToDone(request, response) {
    const { userId } = request.params;

    const doneTasks = await Task.findAndCountAll({
      where: {
        userId,
        status: "DONE"
      }
    });

    let sum = 0;
   
    doneTasks.rows.map(task => sum += task.dataValues.doneDate - task.dataValues.runningDate);
    
    const average = sum/doneTasks.count;

    if(!average) {
      return response.json(0);
    }
  
    return response.json(average);
  }
}