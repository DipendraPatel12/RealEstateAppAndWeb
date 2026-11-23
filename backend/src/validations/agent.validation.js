const Joi = require('joi');

const professionalInfoSchema = Joi.object({
  agencyName: Joi.string().trim().max(150).allow('', null).optional(),
  roleType: Joi.string().valid('Individual', 'Agency').required().messages({
    'any.only': 'Role type must be either Individual or Agency',
    'any.required': 'Role type is required'
  }),
  licenseNumber: Joi.string().trim().max(100).allow('', null).optional(),
  experienceLevel: Joi.string().valid('0-2', '3-5', '6-10', '10+').required().messages({
    'any.only': 'Experience level must be one of: 0-2, 3-5, 6-10, 10+',
    'any.required': 'Experience level is required'
  }),
  location: Joi.string().trim().max(255).required().messages({
    'string.empty': 'Location is required',
    'any.required': 'Location is required'
  })
});

const uploadDocumentSchema = Joi.object({
  documentType: Joi.string()
    .valid('Driving_License', 'Passport', 'PAN_Card', 'Profile_Photo')
    .required()
    .messages({
      'any.only': 'Invalid document type. Allowed: Driving_License, Passport, PAN_Card, Profile_Photo',
      'any.required': 'Document type is required'
    }),
  fileName: Joi.string().trim().required().messages({
    'string.empty': 'File name is required'
  }),
  fileUrl: Joi.string().trim().uri().required().messages({
    'string.empty': 'File URL is required',
    'string.uri': 'File URL must be a valid URI'
  }),
  fileSizeMb: Joi.number().positive().max(10).required().messages({
    'number.max': 'File size must not exceed 10 MB',
    'any.required': 'File size is required'
  })
});

module.exports = {
  professionalInfoSchema,
  uploadDocumentSchema
};
