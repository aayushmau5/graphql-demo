const { users, addUser } = require("./User");

function hello() {
  return "hello, world";
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
