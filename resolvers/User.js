const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.users = async function () {
  const allUsers = await User.find();
  return allUsers;
};

exports.user = async function (_, args) {
  const { id } = args;
  const user = await User.find({ _id: id });
  return user[0];
};

exports.signup = async function (_, args) {
  const { username, email, password } = args.user;
  const user = new User({
    username,
    email,
    password,
  });
  const savedUser = await user.save();
  return {
    user: savedUser,
    token: "hellothere",
  };
};

exports.login = async function (_, args) {
  const { email, password } = args.user;
  const user = await user.find({ email: email });
  console.log(user);
  return {
    user: user[0],
    token: "hellothere",
  };
};
