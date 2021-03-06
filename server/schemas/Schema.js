const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar DateTime

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
    author: NonBlogUser!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type NonBlogUser {
    _id: ID!
    username: String!
    email: String!
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

  type Subscription {
    blogAdded: Blog
  }
`;

module.exports = typeDefs;
