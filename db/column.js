const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Column = new Schema({
  title: { type: String },
  cards: [{ type: ObjectId, ref: 'Card' }],
  board: { type: ObjectId, ref: 'Board' },
  owner: { type: ObjectId, ref: 'User' },
  position: { type: Number },
});

Column.index({ position: 1 });

const ColumnModel = mongoose.model('Column', Column);

module.exports = ColumnModel;
