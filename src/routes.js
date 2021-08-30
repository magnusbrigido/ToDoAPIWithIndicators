const { Router } = require("express");
const { body } = require("express-validator");

const UserController = require("./controllers/UserController");
const AuthenticateUserController = require("./controllers/AuthenticateUserController");
const TaskController = require("./controllers/TaskController");

const ensureAuthentication = require("./middlewares/ensureAuthentication");
const ensureAdmin = require("./middlewares/ensureAdmin");

const routes = Router();

routes.post(
  "/users",
  ensureAuthentication,
  ensureAdmin,
  body("name").isLength({ min: 3}).withMessage("Name must have at least 3 characters"),
  body("email").isEmail().withMessage("Invalid e-mail"),
  body("password").isLength({ min: 6}).withMessage("Passowrd must have at least 6 characters"),
  UserController.create
);

routes.post(
  "/users/authenticate",
  body("email").isEmail().withMessage("Invalid e-mail"),
  body("password").isLength({ min: 6}).withMessage("Passowrd must have at least 6 characters"),
  AuthenticateUserController.authenticate
);

routes.get("/users", ensureAuthentication, ensureAdmin, UserController.list);
routes.get("/users/:id", ensureAuthentication, ensureAdmin, UserController.listById);

routes.put("/users/:id/edit", ensureAuthentication, ensureAdmin, UserController.edit)

routes.delete("/users/:id/delete", ensureAuthentication, ensureAdmin, UserController.delete);

/* TASKS */
routes.post(
  "/tasks",
  body("description").isLength({ min: 5 }).withMessage("Description must have at least 5 characters"),
  ensureAuthentication,
  TaskController.create
);

routes.put("/tasks/:id/edit", ensureAuthentication, TaskController.edit);

module.exports = routes;