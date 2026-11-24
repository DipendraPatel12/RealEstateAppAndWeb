'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { APP_ROUTES } from '@/constants/routes';

const CAPTIONS = {
  [APP_ROUTES.AUTH.LOGIN]:
    'Discover, book, and manage properties effortlessly — all in one platform for buyers, agents, and developers.',
  [APP_ROUTES.AUTH.REGISTER]:
    'Join a platform that connects buyers, agents, and developers to simplify every step of the real estate journey.',
  [APP_ROUTES.AUTH.VERIFY_OTP]:
    'Verify your account to start exploring, listing, or connecting.',
  [APP_ROUTES.AUTH.FORGOT_PASSWORD]:
    'Discover, book, and manage properties effortlessly — all in one platform for buyers, agents, and developers.',
  [APP_ROUTES.AUTH.RESET_PASSWORD]:
    'Discover, book, and manage properties effortlessly — all in one platform for buyers, agents, and developers.',
  [APP_ROUTES.ONBOARDING.PROFESSIONAL_INFO]:
    'Provide your professional details to get verified and start managing listings, clients, and projects seamlessly',
  [APP_ROUTES.ONBOARDING.UPLOAD_DOCUMENTS]:
    'Upload your ID and agency documents to get verified and access all features securely.',
  [APP_ROUTES.ONBOARDING.UNDER_REVIEW]:
    'Thank you for submitting your documents. We\'ll notify you shortly.',
  [APP_ROUTES.ONBOARDING.REJECTED]:
    'Oops! Your submission wasn\'t approved. Let\'s fix it.',
  [APP_ROUTES.ONBOARDING.ACTIVE]:
    'Congratulations! Your verification is complete.'
};

export default function AuthLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const currentCaption =
    CAPTIONS[pathname] ||
    Object.entries(CAPTIONS).find(([route]) => pathname.startsWith(route))?.[1] ||
    'Discover, book, and manage properties effortlessly — all in one platform for buyers, agents, and developers.';

  const isHomeOrLogin =
    pathname === APP_ROUTES.AUTH.LOGIN || pathname === APP_ROUTES.AUTH.REGISTER;

  const handleBack = () => {
    if (isHomeOrLogin) {
      router.push(APP_ROUTES.HOME);
    } else {
      router.back();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#0B0F19]">
      {/* Background Cosmic Image Layer (Fixed so scrolling page keeps smooth background) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/bgrealestate.jpg"
          alt="Real Estate Cosmic Background"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/30" />
      </div>

      {/* Main 2-Column Container */}
      <div className="relative z-10 w-full max-w-[1360px] min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch my-auto">
        {/* Left Column: Top Bar (Brand + Back Button) and Bottom Tagline */}
        <div className="hidden lg:flex lg:col-span-7 xl:col-span-7 flex-col justify-between py-4 pl-4 pr-6">
          {/* Top Bar: 'Real Estate' on far left & '< Back to home' on the right of the dark column */}
          <div className="flex items-center justify-between w-full">
            <Link
              href={APP_ROUTES.HOME}
              className="text-2xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
            >
              Real Estate
            </Link>

            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{isHomeOrLogin ? 'Back to home' : 'Go back'}</span>
            </button>
          </div>

          {/* Bottom Hero Tagline */}
          <div className="pb-4 pt-12">
            <h2 className="text-3xl xl:text-4xl font-semibold text-white leading-snug tracking-tight max-w-[500px] drop-shadow-md">
              {currentCaption}
            </h2>
          </div>
        </div>

        {/* Mobile Header Bar (Only visible on screens smaller than lg) */}
        <div className="lg:hidden flex items-center justify-between w-full px-2 pt-2 mb-2">
          <Link href={APP_ROUTES.HOME} className="text-xl font-bold text-white">
            Real Estate
          </Link>
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1 text-xs text-white/90 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isHomeOrLogin ? 'Back to home' : 'Go back'}</span>
          </button>
        </div>

        {/* Right Column: White Card with Inset Card Scrollbar & Reduced Height */}
        <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end items-stretch w-full">
          <div className="w-full max-w-[540px] bg-white rounded-[40px] sm:rounded-[44px] p-6 sm:p-9 md:p-10 shadow-2xl shadow-indigo-950/40 border border-white/20 flex flex-col justify-between min-h-[640px] max-h-[calc(100vh-3rem)] overflow-y-auto card-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
