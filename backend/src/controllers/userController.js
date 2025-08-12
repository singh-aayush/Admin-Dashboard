const User = require('../models/User');
const Log = require('../models/Log');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    if (!['admin','editor','viewer'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    await Log.create({ action: 'user.role_update', actor: req.user._id, details: `Set ${user.email} role => ${role}` });

    res.json({ message: 'Role updated', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (req.user._id.equals(userId)) return res.status(400).json({ message: 'Cannot delete yourself' });

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Log.create({ action: 'user.delete', actor: req.user._id, details: `Deleted ${user.email}` });

    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};
