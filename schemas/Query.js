const { gql } = require("apollo-server");

const typeDefs = gql`
  input AddUser {
    username: String!
    email: String!
    password: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type Query {
    hello: String!
    users: User
  }

  type Mutation {
    addUser(user: AddUser!): User
  }
`;

module.exports = typeDefs;
