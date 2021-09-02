const { Router } = require("express");
const { body } = require("express-validator");

const TaskController = require("../controllers/TaskController");

const ensureAuthentication = require("../middlewares/ensureAuthentication");
const ensureAdmin = require("../middlewares/ensureAdmin");
const checkValidatorErrors = require("../middlewares/checkValidatorErrors");

const tasksRoutes = Router();

tasksRoutes.post(
  "/",
  body("description").isString().isLength({ min: 5 }).withMessage("Description must have at least 5 characters"),
  ensureAuthentication,
  checkValidatorErrors,
  TaskController.create
);

tasksRoutes.put(
  "/:id/edit",
  body("description").isString().isLength({ min: 5 }).withMessage("Description must have at least 5 characters").optional(),
  ensureAuthentication,
  checkValidatorErrors,
  TaskController.edit
);

tasksRoutes.get("/list", ensureAuthentication, ensureAdmin, TaskController.list);

module.exports = tasksRoutes;