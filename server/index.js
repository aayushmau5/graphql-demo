const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./schemas/Schema");
const resolvers = require("./resolvers/Resolvers");

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

server.listen().then(() => console.log(`Listening at http://localhost:4000`));
