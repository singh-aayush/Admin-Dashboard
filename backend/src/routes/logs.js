const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const logCtrl = require('../controllers/logController');

router.get('/', verifyToken, authorize('admin'), logCtrl.getLogs);

module.exports = router;
