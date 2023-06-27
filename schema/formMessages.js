const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sendername: {
    type: String,
    required: true,
  },
  senderemail: {
    type: String,
    required: true,
  },
  sendermessage: {
    type: String,
    required: true,
  },
});

const formMessage = new mongoose.Schema({
    uniqueid: {
    type: String,
    required: true,
  },
  messages: [messageSchema],
});

const FormMessage = mongoose.model('formmessages', formMessage);

module.exports = FormMessage;
