const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
require("dotenv").config();

const typeDefs = require("./schemas/Query");
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
    let token = "";
    if (req.headers["authorization"]) {
      const authHeader = req.headers["authorization"];
      [_, token] = authHeader.split(" ");
    }
    return {
      req,
      res,
      token,
    };
  },
});

server.listen().then(() => console.log(`Listening at http://localhost:4000`));
