const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { ObjectId } = mongoose.Types;

const Card = new Schema({
  title: { type: String }
});

const CardModel = mongoose.model("Card", Card);

ObjectId.prototype.valueOf = function() {
  return this.toString();
};
module.exports = CardModel;
