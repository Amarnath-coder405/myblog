const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Post = require('../models/Post');

// Create new post
router.post('/', async (req, res) => {
  try {
    const data = req.body;

    // Basic validation
    if (!data.title || !data.body || !data.slug || !data.id) {
      return res.status(400).json({ error: 'Missing required fields: id, slug, title, body' });
    }

    const existing = await Post.findOne({ slug: data.slug });
    if (existing) return res.status(409).json({ error: 'Slug already exists' });

    const post = new Post({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating post' });
  }
});

// Get all posts with optional filtering: status, tag, category, locale
router.get('/', async (req, res) => {
  try {
    const { status, tag, category, locale, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;

    if (tag) filter['tags.name'] = tag;

    if (category) filter['categories.name'] = category;

    // Note: locale filtering is done in the frontend by accessing post.title[locale]

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ publishDate: -1 });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching posts' });
  }
});

// Get single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    // Increment views (fire and forget)
    Post.updateOne({ slug: req.params.slug }, { $inc: { views: 1 } }).exec();

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching post' });
  }
});

// Add comment to a post
router.post('/:slug/comments', async (req, res) => {
  try {
    const { user, comment } = req.body;
    if (!user || !user.id || !user.name || !comment) {
      return res.status(400).json({ error: 'User info and comment text are required' });
    }

    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newComment = {
      id: uuidv4(),
      user: {
        id: user.id,
        name: user.name,
        role: user.role || 'guest'
      },
      comment,
      date: new Date(),
      approved: false // Comments need moderation
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error adding comment' });
  }
});

module.exports = router;
