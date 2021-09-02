const { Router } = require("express");

const usersRoutes = require("./users.routes");
const tasksRoutes = require("./tasks.routes");
const indicatorsRoutes = require("./indicators.routes");

const routes = Router();

routes.use("/users", usersRoutes)
routes.use("/tasks", tasksRoutes);
routes.use("/indicators", indicatorsRoutes);


module.exports = routes;