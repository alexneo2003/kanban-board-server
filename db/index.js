const mongoose = require('mongoose');
const Card = require('./card');
const Column = require('./column');
const User = require('./user');
const Board = require('./board');

const createDB = () => {
  return new Promise((resolve, reject) => {
    return mongoose
      .connect(
        'mongodb+srv://kanban-user:J2Se08VPYPv32R52@cluster0-mggpo.mongodb.net/kanban-board?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          useFindAndModify: false,
          useCreateIndex: true,
          useUnifiedTopology: true,
        }
      )
      .then(
        () => {
          resolve(console.log('db is connected'));
        },
        (err) => {
          console.error(err);
          reject(err);
        }
      );
  });
};

const models = {
  Card,
  Column,
  User,
  Board,
};

module.exports = { createDB, models };
