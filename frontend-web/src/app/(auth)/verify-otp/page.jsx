'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';
import { OtpBoxes } from '@/components/ui/OtpBoxes';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/constants/routes';

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email');
  const typeParam = searchParams.get('type') || 'EMAIL_VERIFICATION';
  const roleParam = searchParams.get('role');

  const registrationEmail = useAppSelector((state) => state.auth.registrationEmail);
  const email = emailParam || registrationEmail || '';

  const { verifyOtpMutation, resendOtpMutation } = useAuth();

  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState(null);
  const [resendSuccess, setResendSuccess] = useState(null);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setResendSuccess(null);

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    if (!email) {
      setError('Missing recipient email. Please try registering again.');
      return;
    }

    try {
      if (typeParam === 'PASSWORD_RESET') {
        router.push(
          `${APP_ROUTES.AUTH.RESET_PASSWORD}?email=${encodeURIComponent(email)}&otp=${otpCode}`
        );
        return;
      }

      const result = await verifyOtpMutation.mutateAsync({
        email,
        otpCode,
        type: typeParam
      });

      if (result.success) {
        const userRole = result.data?.user?.role || roleParam;
        if (userRole === 'AGENT') {
          router.push(APP_ROUTES.ONBOARDING.PROFESSIONAL_INFO);
        } else {
          router.push(APP_ROUTES.HOME);
        }
      } else {
        setError(result.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Verification failed. Please check the code.';
      setError(msg);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setError(null);
    setResendSuccess(null);

    try {
      const result = await resendOtpMutation.mutateAsync({
        email,
        type: typeParam
      });
      if (result.success) {
        setResendSuccess('A new verification code has been sent to your email.');
        setCountdown(60);
      } else {
        setError(result.message || 'Failed to resend code.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend code.';
      setError(msg);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Vertically Centered Main Content Container */}
      <div className="my-auto py-2 w-full flex flex-col">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 mb-2">
            Verify Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            We&apos;ve sent a 6-digit code to{' '}
            <span className="font-semibold text-slate-700">{email || 'your email'}</span>.
            <br />
            Please enter it below to continue.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resendSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-600">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{resendSuccess}</span>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          <div className="py-2">
            <OtpBoxes value={otpCode} onChange={setOtpCode} length={6} />
          </div>

          <Button
            type="submit"
            isLoading={verifyOtpMutation.isPending}
            disabled={otpCode.length !== 6}
            className="w-full"
          >
            Verify
          </Button>
        </form>
      </div>

      {/* Resend Code Footer Pinned to the Bottom */}
      <div className="mt-auto pt-6 text-center text-xs text-slate-500">
        Don&apos;t Receive the code?{' '}
        {countdown > 0 ? (
          <span className="text-slate-400">Resend in {countdown}s</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendOtpMutation.isPending}
            className="font-semibold text-[#6D54FA] hover:underline cursor-pointer disabled:opacity-50"
          >
            {resendOtpMutation.isPending ? 'Sending...' : 'Resend'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-400">Loading verification...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
