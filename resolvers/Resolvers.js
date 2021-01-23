const User = require("../models/User");

function hello() {
  return "hello, world";
}

async function users() {
  const allUsers = await User.find();
  return allUsers;
}

async function addUser(_, args) {
  const { username, email, password } = args.user;
  const user = new User({
    username,
    email,
    password,
  });
  const savedUser = await user.save();
  return savedUser;
}

module.exports = {
  Query: {
    hello,
    users,
  },
  Mutation: {
    addUser,
  },
};
