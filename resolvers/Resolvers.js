const { users, user, signup, login } = require("./User");
const { blogs, blog, addBlog, updateBlog, deleteBlog } = require("./Blog");

const { Kind, GraphQLScalarType } = require("graphql");

// custom "DateTime" scalar
const dateScalar = new GraphQLScalarType({
  name: "DateTime",
  description: "Date custom scalar type",
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10);
    }
    return null;
  },
});

module.exports = {
  DateTime: dateScalar,
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
