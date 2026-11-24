'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User as UserIcon, Mail, Phone, Lock, AlertCircle } from 'lucide-react';
import { registerSchema } from '@/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSelectedRoleTab, setRegistrationEmail } from '@/store/slices/authSlice';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RoleTabs } from '@/components/auth/RoleTabs';
import { APP_ROUTES } from '@/constants/routes';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedRole = useAppSelector((state) => state.auth.selectedRoleTab);
  const { registerMutation } = useAuth();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
      role: selectedRole
    }
  });

  const handleRoleChange = (role) => {
    dispatch(setSelectedRoleTab(role));
    setValue('role', role);
  };

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      const result = await registerMutation.mutateAsync(values);
      if (result.success) {
        dispatch(setRegistrationEmail(values.email));
        router.push(
          `${APP_ROUTES.AUTH.VERIFY_OTP}?email=${encodeURIComponent(values.email)}&role=${values.role}`
        );
      } else {
        setServerError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please check your details.';
      setServerError(msg);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Vertically Centered Content Container */}
      <div className="my-auto py-1 w-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 mb-1">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Sign up to explore properties, manage listings, and connect with clients — all in one place.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <RoleTabs selectedRole={selectedRole} onSelectRole={handleRoleChange} />

        {serverError && (
          <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input
            label="Full Name"
            placeholder="Enter Name"
            leftIcon={<UserIcon className="w-4 h-4" />}
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter Email"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Phone number"
            type="tel"
            placeholder="Enter Phone number"
            leftIcon={<Phone className="w-4 h-4" />}
            error={errors.phone_number?.message}
            {...register('phone_number')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter Password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Enter Confirm Password"
            leftIcon={<Lock className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="pt-1.5">
            <Button type="submit" isLoading={registerMutation.isPending} className="w-full">
              Sign Up
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-3.5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs text-slate-400">
            <span className="bg-white px-3">or</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="social" type="button" className="h-10 text-xs">
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
          <Button variant="social" type="button" className="h-10 text-xs">
            <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.92.04-2.02.62-2.66 1.37-.56.65-.99 1.71-.85 2.73 1.03.08 2.06-.51 2.59-1.23z" />
            </svg>
            Continue with Apple
          </Button>
        </div>
      </div>

      {/* Footer Pinned to the Bottom */}
      <div className="mt-auto pt-4 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link href={APP_ROUTES.AUTH.LOGIN} className="font-semibold text-[#6D54FA] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
