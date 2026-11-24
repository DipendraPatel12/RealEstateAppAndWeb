'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, AlertCircle } from 'lucide-react';
import { forgotPasswordSchema } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/constants/routes';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPasswordMutation } = useAuth();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      const result = await forgotPasswordMutation.mutateAsync(values);
      if (result.success) {
        router.push(
          `${APP_ROUTES.AUTH.VERIFY_OTP}?email=${encodeURIComponent(values.email)}&type=PASSWORD_RESET`
        );
      } else {
        setServerError(result.message || 'Failed to send reset code.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send reset code.';
      setServerError(msg);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Vertically Centered Main Container */}
      <div className="my-auto py-2 w-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 mb-1.5">
            Forgot Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Enter your registered email address and we&apos;ll send you a 6-digit code to reset your password.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            label="Registered Email"
            type="email"
            placeholder="Enter your email"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            isLoading={forgotPasswordMutation.isPending}
            className="w-full mt-2"
          >
            Send Reset Code
          </Button>
        </form>
      </div>

      {/* Footer Pinned to Bottom */}
      <div className="mt-auto pt-6 text-center text-xs text-slate-500">
        Remember your password?{' '}
        <Link href={APP_ROUTES.AUTH.LOGIN} className="font-semibold text-[#6D54FA] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
