const db = require('../models');
const CustomError = require('../utils/CustomError');
const { AgentProfile, AgentDocument, User } = db;

/**
 * Get complete Agent Profile including onboarding progression & uploaded documents
 */
const getProfile = async (userId) => {
  let profile = await AgentProfile.findOne({
    where: { userId },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: AgentDocument, as: 'documents' }
    ]
  });

  if (!profile) {
    // Auto-create initial profile if agent just verified email
    profile = await AgentProfile.create({
      userId,
      onboardingStep: 'EMAIL_VERIFIED',
      kycStatus: 'NOT_SUBMITTED'
    });
    profile = await AgentProfile.findByPk(profile.id, {
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: AgentDocument, as: 'documents' }
      ]
    });
  }

  return profile;
};

/**
 * Step 2: Save Professional Information
 */
const updateProfessionalInfo = async (userId, data) => {
  const { agencyName, roleType, licenseNumber, experienceLevel, location } = data;

  let profile = await AgentProfile.findOne({ where: { userId } });
  if (!profile) {
    profile = await AgentProfile.create({
      userId,
      agencyName,
      roleType,
      licenseNumber,
      experienceLevel,
      location,
      onboardingStep: 'PROFESSIONAL_INFO'
    });
  } else {
    await profile.update({
      agencyName,
      roleType,
      licenseNumber,
      experienceLevel,
      location,
      onboardingStep: 'PROFESSIONAL_INFO'
    });
  }

  return await getProfile(userId);
};

/**
 * Step 3: Upload a document (Government ID or Profile Photo)
 */
const uploadDocument = async (userId, documentData) => {
  const profile = await AgentProfile.findOne({ where: { userId } });
  if (!profile) {
    throw new CustomError('Agent profile not found. Complete previous onboarding steps first.', 404);
  }

  const { documentType, fileName, fileUrl, fileSizeMb } = documentData;

  // Check if this document type already exists; if so, replace/update it
  let document = await AgentDocument.findOne({
    where: {
      agentProfileId: profile.id,
      documentType
    }
  });

  if (document) {
    await document.update({
      fileName,
      fileUrl,
      fileSizeMb,
      status: 'PENDING',
      rejectionReason: null
    });
  } else {
    document = await AgentDocument.create({
      agentProfileId: profile.id,
      documentType,
      fileName,
      fileUrl,
      fileSizeMb,
      status: 'PENDING'
    });
  }

  // Check if required documents exist (Government ID + Profile Photo)
  const allDocs = await AgentDocument.findAll({ where: { agentProfileId: profile.id } });
  const hasGovId = allDocs.some((d) => ['Driving_License', 'Passport', 'PAN_Card'].includes(d.documentType));
  const hasPhoto = allDocs.some((d) => d.documentType === 'Profile_Photo');

  // If both documents are present, advance to DOCUMENTS_UPLOADED and UNDER_REVIEW
  if (hasGovId && hasPhoto) {
    await profile.update({
      onboardingStep: 'DOCUMENTS_UPLOADED',
      kycStatus: 'UNDER_REVIEW',
      rejectionReason: null
    });
  }

  return await getProfile(userId);
};

/**
 * Get all uploaded documents for the agent
 */
const getDocuments = async (userId) => {
  const profile = await AgentProfile.findOne({ where: { userId } });
  if (!profile) {
    throw new CustomError('Agent profile not found', 404);
  }

  return await AgentDocument.findAll({
    where: { agentProfileId: profile.id },
    order: [['createdAt', 'ASC']]
  });
};

/**
 * Admin Simulation: Approve or Reject Agent KYC
 */
const reviewKYC = async (agentProfileId, reviewerId, { kycStatus, rejectionReason }) => {
  const profile = await AgentProfile.findByPk(agentProfileId);
  if (!profile) {
    throw new CustomError('Agent profile not found', 404);
  }

  await profile.update({
    kycStatus,
    rejectionReason: kycStatus === 'REJECTED' ? rejectionReason : null,
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    onboardingStep: kycStatus === 'APPROVED' ? 'COMPLETED' : profile.onboardingStep
  });

  // Update document statuses accordingly
  if (kycStatus === 'APPROVED') {
    await AgentDocument.update({ status: 'APPROVED', rejectionReason: null }, { where: { agentProfileId } });
  } else if (kycStatus === 'REJECTED') {
    await AgentDocument.update({ status: 'REJECTED', rejectionReason }, { where: { agentProfileId } });
  }

  return profile;
};

module.exports = {
  getProfile,
  updateProfessionalInfo,
  uploadDocument,
  getDocuments,
  reviewKYC
};
