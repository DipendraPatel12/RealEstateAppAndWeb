'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/constants/routes';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const otpCode = searchParams.get('otp') || '';

  const { resetPasswordMutation } = useAuth();
  const [serverError, setServerError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (values) => {
    setServerError(null);

    if (!email || !otpCode) {
      setServerError('Reset session is invalid. Please request a new password reset OTP.');
      return;
    }

    try {
      const result = await resetPasswordMutation.mutateAsync({
        ...values,
        email,
        otpCode
      });

      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push(APP_ROUTES.AUTH.LOGIN);
        }, 2000);
      } else {
        setServerError(result.message || 'Password reset failed.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Password reset failed. Please try again.';
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
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Create a strong, new password for your account.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-600">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Password reset successful! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Enter New Password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm New Password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={resetPasswordMutation.isPending}
              disabled={isSuccess}
              className="w-full"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>

      {/* Footer Pinned to Bottom */}
      <div className="mt-auto pt-6 text-center text-xs text-slate-500">
        Back to{' '}
        <Link href={APP_ROUTES.AUTH.LOGIN} className="font-semibold text-[#6D54FA] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
