const { gql } = require("apollo-server");

const typeDefs = gql`
  input Signup {
    username: String!
    email: String!
    password: String!
  }

  input Login {
    email: String!
    password: String!
  }

  input AddBlog {
    title: String!
    post: String!
  }

  input UpdateBlog {
    id: ID!
    title: String!
    post: String!
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

  type Token {
    user: User!
    token: ID!
  }

  type Query {
    hello: String!
    users: [User]!
    user(id: ID!): User
    blogs: [Blog]!
    blog(id: ID!): Blog
    login(user: Login!): Token
  }

  type Mutation {
    signup(user: Signup!): Token
    addBlog(blog: AddBlog!): Blog
    deleteBlog(id: ID!): Blog
    updateBlog(blog: UpdateBlog!): Blog
  }
`;

module.exports = typeDefs;
