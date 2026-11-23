const agentService = require('../services/agent.service');
const { sendResponse } = require('../utils/responseHandler');

const getProfile = async (req, res, next) => {
  try {
    const profile = await agentService.getProfile(req.user.id);
    return sendResponse(res, 200, 'Agent profile retrieved successfully', { profile });
  } catch (error) {
    next(error);
  }
};

const updateProfessionalInfo = async (req, res, next) => {
  try {
    const profile = await agentService.updateProfessionalInfo(req.user.id, req.body);
    return sendResponse(res, 200, 'Professional information updated successfully', { profile });
  } catch (error) {
    next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    const profile = await agentService.uploadDocument(req.user.id, req.body);
    return sendResponse(res, 200, 'Document uploaded successfully', { profile });
  } catch (error) {
    next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const documents = await agentService.getDocuments(req.user.id);
    return sendResponse(res, 200, 'Documents retrieved successfully', { documents });
  } catch (error) {
    next(error);
  }
};

// Admin KYC review endpoint
const reviewKYC = async (req, res, next) => {
  try {
    const { agentProfileId } = req.params;
    const { kycStatus, rejectionReason } = req.body;
    const updatedProfile = await agentService.reviewKYC(agentProfileId, req.user.id, {
      kycStatus,
      rejectionReason
    });
    return sendResponse(res, 200, `Agent KYC status updated to ${kycStatus}`, { profile: updatedProfile });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfessionalInfo,
  uploadDocument,
  getDocuments,
  reviewKYC
};
