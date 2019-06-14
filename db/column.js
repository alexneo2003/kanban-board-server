const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = Schema.Types;

const Column = new Schema({
  title: { type: String },
  cards: [{ type: ObjectId, ref: "Card" }]
});

const ColumnModel = mongoose.model("Column", Column);

module.exports = ColumnModel;
