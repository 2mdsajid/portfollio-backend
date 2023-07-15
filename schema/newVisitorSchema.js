const mongoose = require("mongoose");

const newvisitorSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  values: [
    {
      count: {
        type: Number,
        default: 0,
      },
      date: {
        type: String,
        default: '',
      }
    },
  ],
});

const newVisitor = mongoose.model("NewVisitor", newvisitorSchema);

module.exports = newVisitor;
