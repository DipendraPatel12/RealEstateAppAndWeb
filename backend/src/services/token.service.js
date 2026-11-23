const db = require('../models');
const CustomError = require('../utils/CustomError');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.helper');
const { RefreshToken, User } = db;

/**
 * Issues Access Token + Refresh Token and saves Refresh Token in DB
 */
const generateAuthTokens = async (user, deviceInfo = null, ipAddress = null) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    user_Status: user.user_Status
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Save refresh token in database (expires in 7 days)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId: user.id,
    token: refreshToken,
    deviceInfo,
    ipAddress,
    isRevoked: false,
    expiresAt
  });

  return {
    accessToken,
    refreshToken
  };
};

/**
 * Rotates Refresh Token (invalidates old, issues new pair)
 */
const refreshAuthTokens = async (token, deviceInfo = null, ipAddress = null) => {
  if (!token) {
    throw new CustomError('Refresh token is required', 400);
  }

  // Verify JWT signature
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw new CustomError('Invalid or expired refresh token', 401);
  }

  // Find token in database
  const tokenRecord = await RefreshToken.findOne({
    where: {
      token,
      isRevoked: false
    },
    include: [{ model: User, as: 'user' }]
  });

  if (!tokenRecord || !tokenRecord.user) {
    // Possible token reuse attack - revoke all tokens for this user
    await RefreshToken.update({ isRevoked: true }, { where: { userId: decoded.id } });
    throw new CustomError('Compromised or revoked refresh token. Please login again.', 401);
  }

  // Check expiry in DB
  if (new Date() > new Date(tokenRecord.expiresAt)) {
    await tokenRecord.update({ isRevoked: true });
    throw new CustomError('Refresh token expired. Please login again.', 401);
  }

  // Invalidate old refresh token
  await tokenRecord.update({ isRevoked: true });

  // Issue new pair
  const tokens = await generateAuthTokens(tokenRecord.user, deviceInfo, ipAddress);

  return {
    user: tokenRecord.user,
    tokens
  };
};

/**
 * Revoke a refresh token on logout
 */
const revokeRefreshToken = async (token) => {
  if (!token) return;
  await RefreshToken.update({ isRevoked: true }, { where: { token } });
};

module.exports = {
  generateAuthTokens,
  refreshAuthTokens,
  revokeRefreshToken
};
