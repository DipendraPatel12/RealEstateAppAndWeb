const Joi = require('joi');

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(150).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 2 characters'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address'
  }),
  phone_number: Joi.string().trim().min(7).max(50).required().messages({
    'string.empty': 'Phone number is required'
  }),
  password: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Confirm password is required'
  }),
  role: Joi.string().valid('ADMIN', 'AGENT', 'BUYER', 'OWNER', 'DEVELOPER').default('BUYER')
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Valid email is required'
  }),
  otpCode: Joi.string().length(6).required().messages({
    'string.empty': 'OTP code is required',
    'string.length': 'OTP code must be exactly 6 digits'
  }),
  type: Joi.string()
    .valid('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET', 'LOGIN_2FA')
    .default('EMAIL_VERIFICATION')
});

const resendOtpSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required'
  }),
  type: Joi.string()
    .valid('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET', 'LOGIN_2FA')
    .default('EMAIL_VERIFICATION')
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required'
  }),
  deviceInfo: Joi.string().allow('', null).optional()
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().optional()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required'
  })
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required'
  }),
  otpCode: Joi.string().length(6).required().messages({
    'string.empty': 'OTP code is required'
  }),
  newPassword: Joi.string().min(6).max(100).required().messages({
    'string.empty': 'New password is required',
    'string.min': 'New password must be at least 6 characters'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match'
  })
});

module.exports = {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};
