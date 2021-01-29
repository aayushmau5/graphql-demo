const { users, user, signup, login } = require("./User");
const { blogs, blog, addBlog, updateBlog, deleteBlog } = require("./Blog");

function hello() {
  return "hello, world";
}

module.exports = {
  Query: {
    hello,
    users,
    user,
    blogs,
    blog,
    login,
  },
  Mutation: {
    signup,
    addBlog,
    updateBlog,
    deleteBlog,
  },
};
