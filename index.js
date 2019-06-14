const { ApolloServer } = require("apollo-server-express");
const { importSchema } = require("graphql-import");
const express = require("express");
const query = require("./graphql/query");
const mutation = require("./graphql/mutation");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();
const { createDB, models } = require("./db");
const typeDefs = importSchema("./schema.graphql");

app.use(cookieParser());
app.use(
  session({
    secret: "foo",
    name: "kanbanid",
    resave: true,
    saveUninitialized: false,
    cookie: {
      path: "/",
      domain: "*",
      maxAge: 1000 * 60 * 60 // 1 hour
      // secure: process.env.NODE_ENV === "production",
      //maxAge: ms("1d")
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
const db = createDB();

const context = req => ({
  ...req,
  models,
  db
});

const server = new ApolloServer({
  context,
  typeDefs,
  resolvers: {
    ...query,
    ...mutation
  }
});

server.applyMiddleware({ app, path: "/graphql" });
const opts = {
  port: 4000,
  cors: {
    credentials: true,
    origin: ["*:*"] // your frontend url.
  }
};
app.listen(opts, () => {
  console.log(`🚀 Server ready at http://localhost:4000`);
});
