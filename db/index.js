const mongoose = require("mongoose");
const Card = require("./card");
const Column = require("./column");
const User = require("./user");

const createDB = () =>
  mongoose
    .connect(
      "mongodb+srv://kanban-user:J2Se08VPYPv32R52@cluster0-mggpo.mongodb.net/kanban-board?retryWrites=true&w=majority",
      { useNewUrlParser: true, useFindAndModify: false }
    )
    .then(
      () => {
        console.log("db is connected");
      },
      err => {
        console.error(err);
      }
    );

const models = {
  Card,
  Column,
  User
};

module.exports = { createDB, models };
