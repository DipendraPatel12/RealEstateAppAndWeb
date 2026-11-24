import { z } from 'zod';

export const professionalInfoSchema = z.object({
  agencyName: z.string().optional(),
  roleType: z.enum(['Individual', 'Agency'], {
    message: 'Please select a role type'
  }),
  licenseNumber: z.string().optional(),
  experienceLevel: z.enum(['0-2', '3-5', '6-10', '10+'], {
    message: 'Please select your experience level'
  }),
  location: z.string().min(2, 'Please enter your location')
});

export const documentUploadSchema = z.object({
  documentType: z.enum(['Driving_License', 'Passport', 'PAN_Card'], {
    message: 'Please select document type'
  })
});
