const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  id: { type: String, required: true },  // UUID
  user: {
    id: String,
    name: String,
    role: { type: String, enum: ['admin', 'author', 'guest'], default: 'guest' }
  },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false }
});

module.exports = CommentSchema; // Export schema only, embedded in Post
