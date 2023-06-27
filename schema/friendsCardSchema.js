const mongoose = require('mongoose');

const FriendCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  institution: { type: String },
  firstimpressions: { type: String },
  bestmemory: { type: String },
  id: { type: String, required: true },
  image: { type: String, required: true },
  dob: { type: String, required: true },
  gallery: { type: [String] },
});

const FriendCard = mongoose.model('Friend', FriendCardSchema);

module.exports = FriendCard;
