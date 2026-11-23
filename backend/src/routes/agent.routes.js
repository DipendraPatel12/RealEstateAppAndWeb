const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agent.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  professionalInfoSchema,
  uploadDocumentSchema
} = require('../validations/agent.validation');

// Agent-protected onboarding routes
router.get(
  '/profile',
  authenticate,
  authorize('AGENT', 'ADMIN'),
  agentController.getProfile
);

router.put(
  '/professional-info',
  authenticate,
  authorize('AGENT', 'ADMIN'),
  validate(professionalInfoSchema),
  agentController.updateProfessionalInfo
);

router.post(
  '/documents',
  authenticate,
  authorize('AGENT', 'ADMIN'),
  validate(uploadDocumentSchema),
  agentController.uploadDocument
);

router.get(
  '/documents',
  authenticate,
  authorize('AGENT', 'ADMIN'),
  agentController.getDocuments
);

// Admin-only review route
router.patch(
  '/review-kyc/:agentProfileId',
  authenticate,
  authorize('ADMIN'),
  agentController.reviewKYC
);

module.exports = router;
