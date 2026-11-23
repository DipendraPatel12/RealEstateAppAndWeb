const agentService = require('../services/agent.service');
const { sendResponse } = require('../utils/responseHandler');

class AgentController {
  async getProfile(req, res, next) {
    try {
      const profile = await agentService.getProfile(req.user.id);
      return sendResponse(res, 200, 'Agent profile retrieved successfully', { profile });
    } catch (error) {
      next(error);
    }
  }

  async updateProfessionalInfo(req, res, next) {
    try {
      const profile = await agentService.updateProfessionalInfo(req.user.id, req.body);
      return sendResponse(res, 200, 'Professional information updated successfully', { profile });
    } catch (error) {
      next(error);
    }
  }

  async uploadDocument(req, res, next) {
    try {
      const profile = await agentService.uploadDocument(req.user.id, req.body);
      return sendResponse(res, 200, 'Document uploaded successfully', { profile });
    } catch (error) {
      next(error);
    }
  }

  async getDocuments(req, res, next) {
    try {
      const documents = await agentService.getDocuments(req.user.id);
      return sendResponse(res, 200, 'Documents retrieved successfully', { documents });
    } catch (error) {
      next(error);
    }
  }

  // Admin KYC review endpoint (for reviewing / approving / rejecting agents)
  async reviewKYC(req, res, next) {
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
  }
}

module.exports = new AgentController();
