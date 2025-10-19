const mongoose = require('mongoose');
const CommentSchema = require('./Comment');

const PostSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // UUID
  slug: { type: String, required: true, unique: true },
  title: { type: Map, of: String, required: true }, // localized titles, e.g. { en: 'Title', es: '...' }
  body: { type: Map, of: String, required: true }, // localized bodies
  author: {
    id: String,
    name: String,
    email: String
  },
  excerpt: String,
  publishDate: Date,
  categories: [{ id: String, name: String }],
  tags: [{ id: String, name: String }],
  status: { type: String, enum: ['draft', 'published', 'archived', 'pendingReview'], default: 'draft' },
  moderation: {
    isFlagged: { type: Boolean, default: false },
    flaggedReason: String,
    moderatedBy: String,
    moderatedAt: Date
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    canonicalUrl: String
  },
  imageUrl: String,
  videoUrl: String,
  views: { type: Number, default: 0 },
  reactions: {
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  comments: [CommentSchema],
  readTimeMinutes: Number,
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: String,
  updatedBy: String
});

// Automatically update updatedAt on save
PostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Post', PostSchema);
