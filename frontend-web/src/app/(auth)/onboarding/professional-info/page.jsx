'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { professionalInfoSchema } from '@/schemas/onboarding.schema';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/constants/routes';

export default function ProfessionalInfoPage() {
  const router = useRouter();
  const { updateProfessionalInfoMutation } = useAuth();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      agencyName: '',
      roleType: 'Individual',
      licenseNumber: '',
      experienceLevel: '0-2',
      location: ''
    }
  });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      const result = await updateProfessionalInfoMutation.mutateAsync(values);
      if (result.success) {
        router.push(APP_ROUTES.ONBOARDING.UPLOAD_DOCUMENTS);
      } else {
        setServerError(result.message || 'Failed to update professional info.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update professional information.';
      setServerError(msg);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Vertically Centered Content Container */}
      <div className="my-auto py-2 w-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-slate-900 mb-1.5">
            Professional Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Add your agency or personal info to get verified and start managing listings and clients.
          </p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Agency Name (optional)"
            placeholder="Enter Name"
            error={errors.agencyName?.message}
            {...register('agencyName')}
          />

          <Controller
            name="roleType"
            control={control}
            render={({ field }) => (
              <Select
                label="Role Type"
                placeholder="Select"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { label: 'Individual', value: 'Individual' },
                  { label: 'Agency', value: 'Agency' }
                ]}
                error={errors.roleType?.message}
              />
            )}
          />

          <Input
            label="License / Registration Number"
            placeholder="Enter License / Registration Number"
            error={errors.licenseNumber?.message}
            {...register('licenseNumber')}
          />

          <Controller
            name="experienceLevel"
            control={control}
            render={({ field }) => (
              <Select
                label="Experience Level"
                placeholder="Select"
                value={field.value}
                onChange={field.onChange}
                options={[
                  { label: '0-2', value: '0-2' },
                  { label: '3-5', value: '3-5' },
                  { label: '6-10', value: '6-10' },
                  { label: '10+', value: '10+' }
                ]}
                error={errors.experienceLevel?.message}
              />
            )}
          />

          <Input
            label="Location"
            placeholder="Enter Location"
            error={errors.location?.message}
            {...register('location')}
          />

          <div className="pt-3">
            <Button
              type="submit"
              isLoading={updateProfessionalInfoMutation.isPending}
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
