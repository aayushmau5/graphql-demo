const { users, user, signup, login } = require("./User");
const { blogs, blog, addBlog, updateBlog, deleteBlog } = require("./Blog");
const { AuthenticationError } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

function hello() {
  return "hello, world";
}

function Auth(_, __, { req }) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new AuthenticationError("Cannot login");
  }
  const [, token] = authHeader.split(" ");
  if (!token) {
    throw new AuthenticationError("Cannot login");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(payload);
    return "something";
  } catch (err) {
    throw new AuthenticationError("Login failed");
  }
}

module.exports = {
  Query: {
    hello,
    users,
    user,
    blogs,
    blog,
    login,
    Auth,
  },
  Mutation: {
    signup,
    addBlog,
    updateBlog,
    deleteBlog,
  },
};
