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
  },
  Mutation: {
    signup,
    login,
    addBlog,
    updateBlog,
    deleteBlog,
  },
};
