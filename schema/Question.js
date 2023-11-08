const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    a: String,
    b: String,
    c: String,
    d: String,
  },
  sub: Number,
  topic: Number,
  difficulty: String,
  answer: String,
  explanation: String,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
