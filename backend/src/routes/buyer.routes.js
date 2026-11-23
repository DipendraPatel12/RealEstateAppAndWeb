const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyer.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { selectCountrySchema } = require('../validations/buyer.validation');

// Public route to get list of countries & dial codes for signup & onboarding
router.get('/countries', buyerController.getCountries);

// Buyer-protected routes
router.post(
  '/country',
  authenticate,
  authorize('BUYER', 'ADMIN'),
  validate(selectCountrySchema),
  buyerController.selectCountry
);

router.get(
  '/profile',
  authenticate,
  authorize('BUYER', 'ADMIN'),
  buyerController.getProfile
);

module.exports = router;
