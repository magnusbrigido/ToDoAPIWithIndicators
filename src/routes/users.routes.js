const { Router } = require("express");
const { body } = require("express-validator");

const UserController = require("../controllers/UserController");
const AuthenticateUserController = require("../controllers/AuthenticateUserController");

const ensureAuthentication = require("../middlewares/ensureAuthentication");
const ensureAdmin = require("../middlewares/ensureAdmin");
const checkValidatorErrors = require("../middlewares/checkValidatorErrors");

const usersRoutes = Router();

usersRoutes.post(
  "/",
  ensureAuthentication,
  ensureAdmin,
  body("name").isString().isLength({ min: 3}).withMessage("Name must have at least 3 characters"),
  body("email").isString().isEmail().withMessage("Invalid e-mail"),
  body("password").isLength({ min: 6}).withMessage("Passowrd must have at least 6 characters"),
  checkValidatorErrors,
  UserController.create
);

usersRoutes.post(
  "/authenticate",
  body("email").isString().isEmail().withMessage("Invalid e-mail"),
  body("password").isLength({ min: 6}).withMessage("Passowrd must have at least 6 characters"),
  checkValidatorErrors,
  AuthenticateUserController.authenticate
);

usersRoutes.get("/", ensureAuthentication, ensureAdmin, UserController.list);
usersRoutes.get("/:id", ensureAuthentication, ensureAdmin, UserController.listById);

usersRoutes.put(
  "/:id/edit",
  body("name").isString().isLength({ min: 3}).withMessage("Name must have at least 3 characters").optional(),
  body("email").isString().isEmail().withMessage("Invalid e-mail").optional(),
  body("password").isLength({ min: 6}).withMessage("Passowrd must have at least 6 characters").optional(),
  ensureAuthentication,
  ensureAdmin,
  checkValidatorErrors,
  UserController.edit
);

usersRoutes.delete("/:id/delete", ensureAuthentication, ensureAdmin, UserController.delete);

module.exports = usersRoutes;