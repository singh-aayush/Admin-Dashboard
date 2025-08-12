const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const verifyToken = require('../middleware/auth');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', verifyToken, authCtrl.me);

module.exports = router;
