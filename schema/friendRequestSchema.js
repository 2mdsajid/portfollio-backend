const mongoose = require('mongoose');

const FriendRequest = new mongoose.Schema({
  name: { type: String, required: true },
  opinion: { type: String, required: true },
});

const friendRequest = mongoose.model('friendrequest', FriendRequest);

module.exports = friendRequest;