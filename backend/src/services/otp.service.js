const bcrypt = require('bcryptjs');
const db = require('../models');
const CustomError = require('../utils/CustomError');
const { OTP } = db;
const { Op } = require('sequelize');

/**
 * Generate a random 6-digit numeric OTP
 */
const generateRandomCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Invalidate old active OTPs and create a new one
 */
const createAndSendOTP = async ({ userId = null, identifier, type }) => {
  // 1. Invalidate any existing active OTP for this identifier & type
  await OTP.update(
    { isUsed: true },
    {
      where: {
        identifier,
        type,
        isUsed: false
      }
    }
  );

  // 2. Generate 6-digit code
  const rawOtp = generateRandomCode();
  const hashedOtp = await bcrypt.hash(rawOtp, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  // 3. Persist OTP in database
  await OTP.create({
    userId,
    identifier,
    otpCode: hashedOtp,
    type,
    attempts: 0,
    maxAttempts: 5,
    isUsed: false,
    expiresAt
  });

  // 4. Log code to console for development testing
  console.log(`\n==============================================`);
  console.log(`[OTP DISPATCH] (${type})`);
  console.log(`Recipient: ${identifier}`);
  console.log(`OTP Code:  >>> ${rawOtp} <<< (Expires in 10 mins)`);
  console.log(`==============================================\n`);

  return { rawOtp, expiresAt };
};

/**
 * Validate user-supplied OTP with attempts protection
 */
const verifyOTP = async ({ identifier, otpCode, type }) => {
  const otpRecord = await OTP.findOne({
    where: {
      identifier,
      type,
      isUsed: false,
      expiresAt: {
        [Op.gt]: new Date()
      }
    },
    order: [['createdAt', 'DESC']]
  });

  if (!otpRecord) {
    throw new CustomError('Invalid or expired OTP. Please request a new one.', 400);
  }

  // Check maximum attempts
  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    await otpRecord.update({ isUsed: true });
    throw new CustomError('Too many failed attempts. This OTP has been invalidated. Please request a new one.', 400);
  }

  // Compare supplied code against hash
  const isMatch = await bcrypt.compare(otpCode, otpRecord.otpCode);

  if (!isMatch) {
    await otpRecord.increment('attempts', { by: 1 });
    const remainingAttempts = otpRecord.maxAttempts - (otpRecord.attempts + 1);
    throw new CustomError(`Invalid OTP code. ${remainingAttempts} attempts remaining.`, 400);
  }

  // Mark OTP as consumed
  await otpRecord.update({ isUsed: true });
  return true;
};

module.exports = {
  generateRandomCode,
  createAndSendOTP,
  verifyOTP
};
