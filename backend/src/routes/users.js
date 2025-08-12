const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const userCtrl = require('../controllers/userController');

router.use(verifyToken); // all routes require auth
router.get('/', authorize('admin'), userCtrl.listUsers);
router.put('/:id/role', authorize('admin'), userCtrl.updateUserRole);
router.delete('/:id', authorize('admin'), userCtrl.deleteUser);

module.exports = router;
