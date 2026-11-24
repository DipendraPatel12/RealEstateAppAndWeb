'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Select } from '@/components/ui/Select';
import { FileUploadDropzone } from '@/components/ui/FileUploadDropzone';
import { DocumentChip } from '@/components/ui/DocumentChip';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/constants/routes';

export default function UploadDocumentsPage() {
  const router = useRouter();
  const { uploadDocumentMutation } = useAuth();

  const [documentType, setDocumentType] = useState('Driving_License');
  const [govIdFile, setGovIdFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGovIdSelect = (file) => {
    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
    setGovIdFile({
      name: file.name,
      sizeMb: sizeMb || 4.54,
      previewUrl: URL.createObjectURL(file),
      file
    });
    setError(null);
  };

  const handleProfilePhotoSelect = (file) => {
    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(2));
    setProfilePhotoFile({
      name: file.name,
      sizeMb: sizeMb || 4.54,
      previewUrl: URL.createObjectURL(file),
      file
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!govIdFile && !profilePhotoFile) {
      setError('Please upload at least your Government ID and Profile Photo to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (govIdFile) {
        await uploadDocumentMutation.mutateAsync({
          documentType,
          fileName: govIdFile.name,
          fileUrl: `https://storage.realestate.com/docs/${govIdFile.name}`,
          fileSizeMb: govIdFile.sizeMb
        });
      }

      if (profilePhotoFile) {
        await uploadDocumentMutation.mutateAsync({
          documentType: 'PROFILE_PHOTO',
          fileName: profilePhotoFile.name,
          fileUrl: `https://storage.realestate.com/photos/${profilePhotoFile.name}`,
          fileSizeMb: profilePhotoFile.sizeMb
        });
      }

      router.push(APP_ROUTES.ONBOARDING.UNDER_REVIEW);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload documents.';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Vertically Centered Content Container */}
      <div className="my-auto py-2 w-full flex flex-col">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 mb-1.5">
            Upload Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Upload the required documents to verify your identity and agency. This helps you gain trust and access all features.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Section 1: Government ID */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-700">Government ID</label>
            <Select
              placeholder="Select Document Type"
              value={documentType}
              onChange={setDocumentType}
              options={[
                { label: 'Driving License', value: 'Driving_License' },
                { label: 'Passport', value: 'Passport' },
                { label: 'PAN Card', value: 'PAN_Card' }
              ]}
            />

            {govIdFile ? (
              <DocumentChip
                fileName={govIdFile.name}
                fileSizeMb={govIdFile.sizeMb}
                onDelete={() => setGovIdFile(null)}
              />
            ) : (
              <FileUploadDropzone onFileSelect={handleGovIdSelect} accept=".pdf,.png,.jpg,.jpeg" />
            )}
          </div>

          {/* Section 2: Profile Photo */}
          <div className="flex flex-col gap-2 mt-1">
            <label className="text-xs font-medium text-slate-700">Profile Photo</label>
            {profilePhotoFile ? (
              <DocumentChip
                fileName={profilePhotoFile.name}
                fileSizeMb={profilePhotoFile.sizeMb}
                onDelete={() => setProfilePhotoFile(null)}
              />
            ) : (
              <FileUploadDropzone onFileSelect={handleProfilePhotoSelect} accept=".png,.jpg,.jpeg" />
            )}
          </div>

          <div className="pt-3">
            <Button
              type="submit"
              isLoading={isSubmitting || uploadDocumentMutation.isPending}
              className="w-full"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
