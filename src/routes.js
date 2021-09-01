const { Router } = require("express");
const { body } = require("express-validator");

const UserController = require("./controllers/UserController");
const AuthenticateUserController = require("./controllers/AuthenticateUserController");
const TaskController = require("./controllers/TaskController");
const IndicatorsController = require("./controllers/IndicatorsController");

const ensureAuthentication = require("./middlewares/ensureAuthentication");
const ensureAdmin = require("./middlewares/ensureAdmin");
const checkValidatorErrors = require("./middlewares/checkValidatorErrors");

const routes = Router();

routes.post(
  "/users",
  ensureAuthentication,
  ensureAdmin,
  body("name").isString().isLength({ min: 3}).withMessage("Name must have at least 3 characters"),
  body("email").isString().isEmail().withMessage("Invalid e-mail"),
  body("password").isLength({ min: 6}).withMessage("Passowrd must have at least 6 characters"),
  checkValidatorErrors,
  UserController.create
);

routes.post(
  "/users/authenticate",
  body("email").isString().isEmail().withMessage("Invalid e-mail"),
  body("password").isLength({ min: 6}).withMessage("Passowrd must have at least 6 characters"),
  checkValidatorErrors,
  AuthenticateUserController.authenticate
);

routes.get("/users", ensureAuthentication, ensureAdmin, UserController.list);
routes.get("/users/:id", ensureAuthentication, ensureAdmin, UserController.listById);

routes.put(
  "/users/:id/edit",
  body("name").isString().isLength({ min: 3}).withMessage("Name must have at least 3 characters").optional(),
  body("email").isString().isEmail().withMessage("Invalid e-mail").optional(),
  body("password").isLength({ min: 6}).withMessage("Passowrd must have at least 6 characters").optional(),
  ensureAuthentication,
  ensureAdmin,
  checkValidatorErrors,
  UserController.edit
);

routes.delete("/users/:id/delete", ensureAuthentication, ensureAdmin, UserController.delete);

/* TASKS */
routes.post(
  "/tasks",
  body("description").isString().isLength({ min: 5 }).withMessage("Description must have at least 5 characters"),
  ensureAuthentication,
  checkValidatorErrors,
  TaskController.create
);

routes.put(
  "/tasks/:id/edit",
  body("description").isString().isLength({ min: 5 }).withMessage("Description must have at least 5 characters").optional(),
  ensureAuthentication,
  checkValidatorErrors,
  TaskController.edit
);

routes.get("/tasks/list", ensureAuthentication, ensureAdmin, TaskController.list);

/* INDICATORS */
routes.get("/indicators/doneTasks", IndicatorsController.totalDoneTasks);
routes.get("/indicators/:userId/averageDoneTasks", IndicatorsController.averageDoneTasks);
routes.get("/indicators/:userId/timeAverageCreatedToRunning", IndicatorsController.timeAverageCreatedToRunning);
routes.get("/indicators/:userId/timeAverageRunningToDone", IndicatorsController.timeAverageRunningToDone);


module.exports = routes;