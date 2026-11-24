'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronLeft } from 'lucide-react';
import { DocumentChip } from '@/components/ui/DocumentChip';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/constants/routes';

export default function UnderReviewPage() {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Vertically Centered Content Container */}
      <div className="my-auto py-2 w-full flex flex-col items-start">
        {/* Yellow Clock Icon */}
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-6">
          <Clock className="w-7 h-7" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 mb-2">
          Your Account is <span className="text-amber-500">Under Review</span>
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
          Thank you for submitting your verification documents. Our team is reviewing your account and it will be approved within 24–48 hours.
          <br />
          You will receive a notification once your account is active.
        </p>

        {/* Uploaded Documents List */}
        <div className="w-full flex flex-col gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-700">Uploaded Document</span>
          <DocumentChip
            fileName="License_Certificate.pdf"
            fileSizeMb={4.54}
            status="PENDING"
          />
          <DocumentChip
            fileName="Profile.png"
            fileSizeMb={4.54}
            status="PENDING"
          />
        </div>

        {/* Action Button */}
        <Button
          type="button"
          onClick={() => router.push(APP_ROUTES.AUTH.LOGIN)}
          className="w-full flex items-center justify-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to login</span>
        </Button>
      </div>
    </div>
  );
}
