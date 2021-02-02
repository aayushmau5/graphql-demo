const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { User } = require("../utils/DB");
const {
  validateLoginInput,
  validateSignupInput,
} = require("../utils/Validate");
const isValidId = require("../utils/CheckId");

exports.users = async function () {
  return await User.getAllUsers();
};

exports.user = async function (_, args) {
  const { id } = args;
  isValidId(id);
  return await User.getSpecificUser(id);
};

exports.signup = async function (_, args) {
  try {
    const { username, email, password } = validateSignupInput(args.user);
    const user = new User(username, email, password);
    const savedUser = await user.signup();
    const payload = {
      id: savedUser._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return {
      user: savedUser,
      token,
    };
  } catch (err) {
    if (err.code === 11000) {
      throw new UserInputError("Email already registered");
    }
    return err;
  }
};

exports.login = async function (_, args) {
  try {
    const { email, password } = validateLoginInput(args.user);
    const user = await User.login(email, password);
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return {
      user: user,
      token,
    };
  } catch (err) {
    return err;
  }
};
