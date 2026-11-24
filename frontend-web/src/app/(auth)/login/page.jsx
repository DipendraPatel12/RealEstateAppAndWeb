'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { loginSchema } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/constants/routes';

export default function LoginPage() {
  const router = useRouter();
  const { loginMutation } = useAuth();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      const result = await loginMutation.mutateAsync(values);
      if (result.success && result.data?.user) {
        const user = result.data.user;

        if (user.role === 'AGENT') {
          const profile = user.agentProfile;
          if (profile?.onboardingStep === 'STEP_2_PROFESSIONAL_INFO') {
            router.push(APP_ROUTES.ONBOARDING.PROFESSIONAL_INFO);
          } else if (profile?.onboardingStep === 'STEP_3_DOCUMENT_UPLOAD') {
            router.push(APP_ROUTES.ONBOARDING.UPLOAD_DOCUMENTS);
          } else if (profile?.onboardingStep === 'COMPLETED') {
            if (profile.kycStatus === 'UNDER_REVIEW') {
              router.push(APP_ROUTES.ONBOARDING.UNDER_REVIEW);
            } else if (profile.kycStatus === 'REJECTED') {
              router.push(APP_ROUTES.ONBOARDING.REJECTED);
            } else {
              router.push(APP_ROUTES.ONBOARDING.ACTIVE);
            }
          } else {
            router.push(APP_ROUTES.ONBOARDING.PROFESSIONAL_INFO);
          }
        } else {
          router.push(APP_ROUTES.HOME);
        }
      } else {
        setServerError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your email and password.';
      setServerError(msg);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Vertically Centered Main Form Container */}
      <div className="my-auto py-2 w-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 mb-1.5">
            Welcome Back!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Access your account to explore, manage, and grow your real estate connections.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email/ Phone number"
            placeholder="Enter Email/ Phone number"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex flex-col gap-1.5">
            <Input
              label="Password"
              type="password"
              placeholder="Enter Password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex justify-end pt-0.5">
              <Link
                href={APP_ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-xs font-medium text-[#6D54FA] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" isLoading={loginMutation.isPending} className="w-full">
              Log In
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs text-slate-400">
            <span className="bg-white px-3">or</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="social" type="button" className="h-11 text-xs">
            <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </Button>
          <Button variant="social" type="button" className="h-11 text-xs">
            <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.66 1.37-.56.65-.99 1.71-.85 2.73 1.03.08 2.06-.51 2.59-1.23z" />
            </svg>
            Continue with Apple
          </Button>
        </div>
      </div>

      {/* Footer Pinned to the Bottom */}
      <div className="mt-auto pt-6 text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href={APP_ROUTES.AUTH.REGISTER} className="font-semibold text-[#6D54FA] hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
