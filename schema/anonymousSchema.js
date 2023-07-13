const mongoose = require("mongoose");

const anonymousMessage = new mongoose.Schema({
  uniqueid: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const AnonymousMessage = mongoose.model("anonymous", anonymousMessage);

module.exports = AnonymousMessage;
