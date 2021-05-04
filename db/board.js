const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const Board = new Schema({
  owner: { type: ObjectId, ref: 'User' },
  title: { type: String },
  columns: [{ type: ObjectId, ref: 'Column' }],
  image: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1502139214982-d0ad755818d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
  },
});

const BoardModel = mongoose.model('Board', Board);

module.exports = BoardModel;
