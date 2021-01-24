const { gql } = require("apollo-server");

const typeDefs = gql`
  input AddUser {
    username: String!
    email: String!
    password: String!
  }

  input AddBlog {
    title: String!
    post: String!
    author: ID!
  }

  type Blog {
    _id: ID!
    title: String!
    post: String!
    author: User!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    blogs: [Blog]!
  }

  type Query {
    hello: String!
    users: User
  }

  type Mutation {
    addUser(user: AddUser!): User
    addBlog(blog: AddBlog!): Blog
  }
`;

module.exports = typeDefs;
