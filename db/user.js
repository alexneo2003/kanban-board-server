const mongoose = require('mongoose');

const { Schema } = mongoose;

const { ObjectId } = mongoose.Types;

const User = new Schema({
  email: { type: String },
  name: { type: String },
  password: { type: String },
});

const UserModel = mongoose.model('User', User);

ObjectId.prototype.valueOf = function () {
  return this.toString();
};
module.exports = UserModel;
