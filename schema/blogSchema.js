const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  comment: { type: String },
});

const UpdatedStateSchema = new mongoose.Schema({
  state: { type: Boolean },
  date: { type: Date },
});

const SingleBlogSchema = new mongoose.Schema({
  _id: { type: String },
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String },
  author: { type: String },
  intro: { type: String, required: true },
  introimage: { type: String, required: true },
  content: { type: String, required: true },
  review: { type: Boolean },
  published: { type: Boolean },
  keywords: { type: [String] },
  readtime: { type: String },
  upvote: { type: [String] },
  downvote: { type: [String] },
  comments: [CommentSchema],
  isupdated: { type: UpdatedStateSchema },
  date: { type: Date },
  views: { type: Number },
  rating: { type: Number },
});

const SingleBlog = mongoose.model('Blog', SingleBlogSchema);

module.exports = SingleBlog;
