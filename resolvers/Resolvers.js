const { users, user, signup, login } = require("./User");
const { blogs, blog, addBlog, updateBlog, deleteBlog } = require("./Blog");

module.exports = {
  Query: {
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
