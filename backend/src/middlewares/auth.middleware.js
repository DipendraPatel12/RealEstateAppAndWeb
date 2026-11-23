const CustomError = require('../utils/CustomError');
const { verifyAccessToken } = require('../utils/jwt.helper');

const authenticate = (req, res, next) => {
  let token = null;

  // 1. Try to extract from Authorization Bearer header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  // 2. Fallback to access_token cookie if available
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new CustomError('Authentication required. No token provided.', 401));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new CustomError('Access token expired. Please refresh your session.', 401));
    }
    return next(new CustomError('Invalid access token.', 401));
  }
};

module.exports = authenticate;
