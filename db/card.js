const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = mongoose.Types;

const Card = new Schema({
  title: { type: String },
  board: { type: ObjectId, ref: 'Board' },
  column: { type: ObjectId, ref: 'Column' },
  owner: { type: ObjectId, ref: 'User' },
  position: { type: Number },
});

Card.index({ position: 1 });

const CardModel = mongoose.model('Card', Card);

ObjectId.prototype.valueOf = function () {
  return this.toString();
};
module.exports = CardModel;
