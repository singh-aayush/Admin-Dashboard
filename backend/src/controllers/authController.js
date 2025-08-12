const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const Log = require('../models/Log');

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = new User({ fullName, email, password, role });
    await user.save();

    // log
    await Log.create({ action: 'user.register', actor: user._id, details: `User ${email} registered` });

    const token = generateToken(user._id);
    res.status(201).json({
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // log
    await Log.create({ action: 'user.login', actor: user._id, details: `User ${email} logged in` });

    const token = generateToken(user._id);
    res.json({
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
};
