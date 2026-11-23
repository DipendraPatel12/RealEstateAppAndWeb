const db = require('../models');
const CustomError = require('../utils/CustomError');
const otpService = require('./otp.service');
const tokenService = require('./token.service');
const { User, Buyer, AgentProfile, AgentDocument, Country } = db;
const { Op } = require('sequelize');

/**
 * Register a new user (Buyer, Agent, Developer, Owner)
 */
const register = async (data) => {
  const { fullName, email, phone_number, password, role = 'BUYER' } = data;

  // 1. Check if email or phone already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone_number }]
    }
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new CustomError('An account with this email already exists', 409);
    }
    throw new CustomError('An account with this phone number already exists', 409);
  }

  // 2. Create User record (Inactive until OTP verified)
  const newUser = await User.create({
    fullName,
    email,
    phone_number,
    password,
    role,
    is_email_varified: false,
    user_Status: 'INACTIVE'
  });

  // 3. Initialize role-specific profile
  if (role === 'BUYER') {
    await Buyer.create({ userId: newUser.id });
  } else if (role === 'AGENT') {
    await AgentProfile.create({
      userId: newUser.id,
      onboardingStep: 'EMAIL_VERIFIED',
      kycStatus: 'NOT_SUBMITTED'
    });
  }

  // 4. Generate and send 6-digit OTP
  const { rawOtp, expiresAt } = await otpService.createAndSendOTP({
    userId: newUser.id,
    identifier: newUser.email,
    type: 'EMAIL_VERIFICATION'
  });

  return {
    user: newUser.toSafeObject(),
    otpExpiresAt: expiresAt,
    message: 'Account created successfully. Please verify the 6-digit OTP sent to your email.'
  };
};

/**
 * Helper to fetch only the relevant role profile based on user.role
 */
const getUserWithRoleProfile = async (user) => {
  const safeUser = user.toSafeObject();

  if (user.role === 'BUYER') {
    const buyerProfile = await Buyer.findOne({
      where: { userId: user.id },
      include: [{ model: Country, as: 'exploringCountry' }]
    });
    return { ...safeUser, buyerProfile };
  }

  if (user.role === 'AGENT') {
    const agentProfile = await AgentProfile.findOne({
      where: { userId: user.id },
      include: [{ model: AgentDocument, as: 'documents' }]
    });
    return { ...safeUser, agentProfile };
  }

  return safeUser;
};

/**
 * Verify registration OTP and activate account
 */
const verifyOtp = async ({ email, otpCode, type, deviceInfo, ipAddress }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new CustomError('User not found with this email', 404);
  }

  // Verify OTP code
  await otpService.verifyOTP({
    identifier: email,
    otpCode,
    type
  });

  // If Email verification, activate user
  if (type === 'EMAIL_VERIFICATION') {
    await user.update({
      is_email_varified: true,
      user_Status: 'ACTIVE'
    });
  }

  // Generate tokens
  const tokens = await tokenService.generateAuthTokens(user, deviceInfo, ipAddress);
  const userWithProfile = await getUserWithRoleProfile(user);

  return {
    user: userWithProfile,
    tokens
  };
};

/**
 * Resend OTP
 */
const resendOtp = async ({ email, type }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new CustomError('User not found with this email', 404);
  }

  const { rawOtp, expiresAt } = await otpService.createAndSendOTP({
    userId: user.id,
    identifier: email,
    type
  });

  return {
    message: 'A new 6-digit OTP has been sent.',
    expiresAt
  };
};

/**
 * User login
 */
const login = async ({ email, password, deviceInfo, ipAddress }) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new CustomError('Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new CustomError('Invalid email or password', 401);
  }

  // Check account status
  if (user.user_Status === 'BLOCKED') {
    throw new CustomError('Your account has been suspended. Please contact support.', 403);
  }

  // Check if email is verified
  if (!user.is_email_varified) {
    await otpService.createAndSendOTP({
      userId: user.id,
      identifier: user.email,
      type: 'EMAIL_VERIFICATION'
    });

    return {
      requiresVerification: true,
      email: user.email,
      message: 'Your account is not verified yet. A 6-digit verification code has been sent to your email.'
    };
  }

  // Generate tokens
  const tokens = await tokenService.generateAuthTokens(user, deviceInfo, ipAddress);
  const userWithProfile = await getUserWithRoleProfile(user);

  return {
    user: userWithProfile,
    tokens
  };
};

/**
 * Refresh Token rotation
 */
const refreshTokens = async (refreshToken, deviceInfo, ipAddress) => {
  return await tokenService.refreshAuthTokens(refreshToken, deviceInfo, ipAddress);
};

/**
 * Logout user
 */
const logout = async (refreshToken) => {
  if (refreshToken) {
    await tokenService.revokeRefreshToken(refreshToken);
  }
};

/**
 * Forgot password: send reset OTP
 */
const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return { message: 'If an account exists with this email, a reset code has been sent.' };
  }

  await otpService.createAndSendOTP({
    userId: user.id,
    identifier: email,
    type: 'PASSWORD_RESET'
  });

  return { message: 'If an account exists with this email, a reset code has been sent.' };
};

/**
 * Reset password using OTP
 */
const resetPassword = async ({ email, otpCode, newPassword }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new CustomError('User not found', 404);
  }

  // Verify reset OTP
  await otpService.verifyOTP({
    identifier: email,
    otpCode,
    type: 'PASSWORD_RESET'
  });

  // Update password
  await user.update({ password: newPassword });

  // Revoke all existing sessions for safety
  await db.RefreshToken.update({ isRevoked: true }, { where: { userId: user.id } });

  return { message: 'Password has been successfully reset. Please log in with your new password.' };
};

/**
 * Get current authenticated user profile
 */
const getMe = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new CustomError('User not found', 404);
  }

  return await getUserWithRoleProfile(user);
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshTokens,
  logout,
  forgotPassword,
  resetPassword,
  getMe
};
