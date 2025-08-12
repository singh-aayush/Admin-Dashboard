const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const postCtrl = require('../controllers/postController');

router.get('/', verifyToken, postCtrl.getPosts);

// create post: admin/editor
router.post('/', verifyToken, authorize('admin','editor'), postCtrl.createPost);

// update/delete: admin/editor
router.put('/:id', verifyToken, authorize('admin','editor'), postCtrl.updatePost);
router.delete('/:id', verifyToken, authorize('admin','editor'), postCtrl.deletePost);

module.exports = router;
