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

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15min",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15,
      secure: process.env.NODE_ENV === "production",
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === "production",
    });

    return {
      user: savedUser,
    };
  } catch (err) {
    if (err.code === 11000) {
      throw new UserInputError("Email already registered");
    }
    return err;
  }
};

exports.login = async function (_, args, { res }) {
  try {
    const { email, password } = validateLoginInput(args.user);
    const user = await User.login(email, password);
    const payload = {
      id: user._id,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15min",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("access-token", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 15, // 15 Minutes
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.cookie("refresh-token", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 Days
      secure: process.env.NODE_ENV === "production",
    });

    return {
      user: user,
    };
  } catch (err) {
    return err;
  }
};

exports.logout = async function (_, __, { res }) {
  res.clearCookie("access-token");
  res.clearCookie("refresh-token");
  return true;
};
