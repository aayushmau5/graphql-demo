const { ApolloServer, gql } = require("apollo-server");
require("dotenv").config();

const typeDefs = gql`
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => "hello, world",
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Listening on ${url}`);
});
