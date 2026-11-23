const authService = require('../services/auth.service');
const { sendResponse } = require('../utils/responseHandler');

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return sendResponse(res, 201, result.message, {
      user: result.user,
      otpExpiresAt: result.otpExpiresAt
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otpCode, type } = req.body;
    const deviceInfo = req.headers['user-agent'] || null;
    const ipAddress = req.ip || null;

    const result = await authService.verifyOtp({
      email,
      otpCode,
      type,
      deviceInfo,
      ipAddress
    });

    // Set httpOnly cookie for Web
    if (result.tokens && result.tokens.refreshToken) {
      setRefreshTokenCookie(res, result.tokens.refreshToken);
    }

    return sendResponse(res, 200, 'Account verified successfully', result);
  } catch (error) {
    next(error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { email, type } = req.body;
    const result = await authService.resendOtp({ email, type });
    return sendResponse(res, 200, result.message, { expiresAt: result.expiresAt });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, deviceInfo } = req.body;
    const clientDeviceInfo = deviceInfo || req.headers['user-agent'] || null;
    const ipAddress = req.ip || null;

    const result = await authService.login({
      email,
      password,
      deviceInfo: clientDeviceInfo,
      ipAddress
    });

    // If user requires OTP verification first
    if (result.requiresVerification) {
      return sendResponse(res, 403, result.message, {
        requiresVerification: true,
        email: result.email
      });
    }

    // Set httpOnly cookie for Web
    if (result.tokens && result.tokens.refreshToken) {
      setRefreshTokenCookie(res, result.tokens.refreshToken);
    }

    return sendResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token =
      (req.cookies && req.cookies.refreshToken) ||
      req.body.refreshToken ||
      req.headers['x-refresh-token'];

    const deviceInfo = req.headers['user-agent'] || null;
    const ipAddress = req.ip || null;

    const result = await authService.refreshTokens(token, deviceInfo, ipAddress);

    // Set rotated cookie for Web
    if (result.tokens && result.tokens.refreshToken) {
      setRefreshTokenCookie(res, result.tokens.refreshToken);
    }

    return sendResponse(res, 200, 'Tokens refreshed successfully', result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token =
      (req.cookies && req.cookies.refreshToken) ||
      req.body.refreshToken ||
      req.headers['x-refresh-token'];

    await authService.logout(token);
    clearRefreshTokenCookie(res);

    return sendResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return sendResponse(res, 200, 'Profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return sendResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    const result = await authService.resetPassword({ email, otpCode, newPassword });
    return sendResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword
};
