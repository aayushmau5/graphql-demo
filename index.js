const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./schemas/Query");
const resolvers = require("./resolvers/Resolvers");

const app = express();

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const connection = mongoose.connection;
connection.on(
  "error",
  console.error.bind(console, "Error occured connecting to the database")
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  debug: false,
  context: ({ req, res }) => {
    return {
      req,
      res,
    };
  },
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Listening at http://localhost:4000${server.graphqlPath}`)
);
