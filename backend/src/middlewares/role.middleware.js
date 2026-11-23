const CustomError = require('../utils/CustomError');

/**
 * Enforces role-based permissions
 * @param  {...string} allowedRoles - E.g. 'ADMIN', 'AGENT', 'BUYER'
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new CustomError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new CustomError(
          `Forbidden. Role '${req.user.role}' does not have permission to access this resource.`,
          403
        )
      );
    }

    next();
  };
};

module.exports = authorize;
