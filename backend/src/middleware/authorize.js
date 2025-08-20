// usage: authorize('admin') or authorize('admin','editor')
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No authenticated user' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You are not allowed' });
    }
    next();
  };
}

module.exports = authorize;
