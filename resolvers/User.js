const User = require("../models/User");

export async function users() {
  const allUsers = await User.find();
  return allUsers;
}

export async function addUser(_, args) {
  const { username, email, password } = args.user;
  const user = new User({
    username,
    email,
    password,
  });
  const savedUser = await user.save();
  return savedUser;
}
