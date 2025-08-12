const Log = require('../models/Log');

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await Log.find().populate('actor', 'email fullName role').sort({ createdAt: -1 }).limit(200);
    res.json({ logs });
  } catch (err) {
    next(err);
  }
};
