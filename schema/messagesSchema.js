const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema({
  rating: { type: Number, default: 0 },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  opinion: { type: String, default: '' },
  message: { type: String, default: '' },
});

const Message = mongoose.model('Message', messagesSchema);

module.exports = Message;
