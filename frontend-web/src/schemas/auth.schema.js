import { z } from 'zod';

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone_number: z
      .string()
      .min(7, 'Please enter a valid phone number')
      .max(20, 'Phone number is too long'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
    role: z.enum(['BUYER', 'AGENT', 'DEVELOPER'])
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your email or phone number'),
  password: z.string().min(1, 'Please enter your password')
});

export const otpSchema = z.object({
  otpCode: z.string().length(6, 'Verification code must be exactly 6 digits')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
