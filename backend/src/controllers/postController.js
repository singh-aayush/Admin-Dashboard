const Post = require('../models/Post');
const Log = require('../models/Log');

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, published = false } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Missing fields' });

    const post = await Post.create({
      title,
      content,
      author: req.user._id,
      published
    });

    await Log.create({ action: 'post.create', actor: req.user._id, details: `Created post ${post._id}` });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    // viewers should only see published posts; editors/admins can see all
    const query = {};
    if (!['admin','editor'].includes(req.user?.role)) {
      query.published = true;
    }
    const posts = await Post.find(query).populate('author', 'fullName email role');
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const { title, content, published } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // editors can edit any post;
    post.title = title ?? post.title;
    post.content = content ?? post.content;
    if (published !== undefined) post.published = published;
    post.updatedAt = new Date();
    await post.save();

    await Log.create({ action: 'post.update', actor: req.user._id, details: `Updated post ${post._id}` });

    res.json({ post });
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);
    await Log.create({ action: 'post.delete', actor: req.user._id, details: `Deleted post ${postId}` });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};
