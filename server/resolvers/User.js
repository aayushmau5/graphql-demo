const UserController = require("../controllers/UserController");
const authenticate = require("../utils/Auth");

exports.users = UserController.users;

exports.user = UserController.user;

exports.signup = UserController.signup;

exports.login = UserController.login;

exports.logout = UserController.logout;

exports.me = authenticate();
