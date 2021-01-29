const UserController = require("../controllers/UserController");
const authenticate = require("../utils/Auth");

exports.users = authenticate(UserController.users);

exports.user = UserController.user;

exports.signup = UserController.signup;

exports.login = UserController.login;
