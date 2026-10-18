const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
  // Get token from auth-token header or Authorization Bearer header
  const token = req.header('auth-token') || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access denied. Please authenticate with a valid token.',
    });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'imovies_jwt_secret');
    req.user = data.user || data;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = fetchUser;
