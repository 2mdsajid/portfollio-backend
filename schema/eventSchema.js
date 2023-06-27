const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  yr: { type: Number, required: true },
  mon: { type: String, required: true },
  day: { type: Number, required: true },
  src: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
