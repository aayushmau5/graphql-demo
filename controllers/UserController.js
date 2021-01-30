const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const {
  validateLoginInput,
  validateSignupInput,
} = require("../utils/Validate");

exports.users = async function () {
  const allUsers = await User.find().populate("blogs");
  console.log(allUsers);
  return allUsers;
};

exports.user = async function (_, args) {
  const { id } = args;
  const user = await User.find({ _id: id }).populate("blogs");
  return user[0];
};

exports.signup = async function (_, args) {
  try {
    const { username, email, password } = validateSignupInput(args.user);
    const hashedPassword = await bcrypt.hash(password, 16);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
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
    console.log(err);
    if (err.code === 11000) {
      throw new UserInputError("Email already registered");
    }
  }
};

exports.login = async function (_, args) {
  try {
    const { email, password } = validateLoginInput(args.user);
    const user = await User.find({ email: email });
    if (!user[0]) {
      throw new UserInputError("Invalid username or password");
    }
    const result = await bcrypt.compare(password, user[0].password);
    if (!result) {
      throw new UserInputError("Invalid username or password");
    }
    const payload = {
      id: user[0]._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return {
      user: user[0],
      token,
    };
  } catch (err) {
    return err;
  }
};
