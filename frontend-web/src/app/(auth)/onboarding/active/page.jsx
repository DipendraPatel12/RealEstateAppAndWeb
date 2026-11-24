'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { DocumentChip } from '@/components/ui/DocumentChip';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/constants/routes';

export default function ActiveAccountPage() {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Vertically Centered Content Container */}
      <div className="my-auto py-2 w-full flex flex-col items-start">
        {/* Green Check Icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6">
          <Check className="w-7 h-7" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 mb-2">
          Your Account is <span className="text-emerald-500">Active!</span>
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
          Your verification documents have been approved.
        </p>

        {/* Uploaded Documents List */}
        <div className="w-full flex flex-col gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-700">Uploaded Document</span>
          <DocumentChip
            fileName="License_Certificate.pdf"
            fileSizeMb={4.54}
            status="APPROVED"
          />
          <DocumentChip
            fileName="Profile.png"
            fileSizeMb={4.54}
            status="APPROVED"
          />
        </div>

        {/* Action Button */}
        <Button
          type="button"
          onClick={() => router.push(APP_ROUTES.HOME)}
          className="w-full"
        >
          View plan
        </Button>
      </div>
    </div>
  );
}
