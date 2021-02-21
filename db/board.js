const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Board = new Schema({
  owner: { type: ObjectId, ref: 'User' },
  title: { type: String },
  columns: [{ type: ObjectId, ref: 'Column' }],
});

const BoardModel = mongoose.model('Board', Board);

module.exports = BoardModel;
