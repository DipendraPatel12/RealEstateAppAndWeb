'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { DocumentChip } from '@/components/ui/DocumentChip';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/constants/routes';

export default function RejectedPage() {
  const router = useRouter();
  const agentProfile = useAppSelector((state) => state.auth.user?.agentProfile);
  const rejectReason =
    agentProfile?.rejectionReason || 'Document is blurry or unreadable';

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Vertically Centered Content Container */}
      <div className="my-auto py-2 w-full flex flex-col items-start">
        {/* Red X Icon */}
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6">
          <X className="w-7 h-7" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 mb-2">
          Verification <span className="text-red-500">Unsuccessful</span>
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
          Unfortunately, your submitted documents could not be approved.
          <br />
          Please review the requirements and upload the correct documents to complete your account verification.
        </p>

        {/* Uploaded Documents List */}
        <div className="w-full flex flex-col gap-2 mb-8">
          <span className="text-xs font-semibold text-slate-700">Uploaded Document</span>
          <DocumentChip
            fileName="License_Certificate.pdf"
            fileSizeMb={4.54}
            status="REJECTED"
            rejectionReason={rejectReason}
          />
        </div>

        {/* Action Button */}
        <Button
          type="button"
          onClick={() => router.push(APP_ROUTES.ONBOARDING.UPLOAD_DOCUMENTS)}
          className="w-full"
        >
          Resubmit Documents
        </Button>
      </div>
    </div>
  );
}
