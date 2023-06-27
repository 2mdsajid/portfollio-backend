const mongoose = require('mongoose');

const WorkRequest = new mongoose.Schema({
  name: { type: String, required:true },
  email: { type: String, required:true },
  phonenumber: { type: String, required:true },
  description:{ type: String, required:true}
});

const Request = mongoose.model('Request', WorkRequest);

module.exports = Request;
