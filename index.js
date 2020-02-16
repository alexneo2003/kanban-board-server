const { ApolloServer } = require("apollo-server-express");
const { importSchema } = require("graphql-import");
const express = require("express");
const query = require("./graphql/query");
const mutation = require("./graphql/mutation");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const { createDB, models } = require("./db");
const typeDefs = importSchema(path.join(__dirname, "./schema.graphql"));
app.use(cookieParser());
app.use(
  session({
    secret: "foo",
    name: "kanbanid",
    resave: true,
    saveUninitialized: false,
    cookie: {
      //path: "/",
      //domain: "*",
      maxAge: 1000 * 60 * 60 * 24 * 30 // 1 month
      // secure: process.env.NODE_ENV === "production",
      //maxAge: ms("1d")
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
const db = createDB();
//app.use((req, res, next) => {
//  console.log("request", req.headers);
//  next();
//});
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
  },
  introspection: true, // enables introspection of the schema
  playground: true // enables the actual playground
});
server.applyMiddleware({
  app,
  path: "/",
  cors: {
    credentials: true,
    origin: [
      "https://eeqwu.csb.dev",
      "https://eeqwu.codesandbox.io",
      "https://csb-eeqwu-gmkjkvyotg.now.sh",
      "https://kanban.now.sh",
      "http://localhost:3000"
    ]
  }
});
const opts = {
  port: 4000
};
app.listen(opts, () => {
  console.log(`🚀 Server ready at http://localhost:4000`);
});