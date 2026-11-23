const buyerService = require('../services/buyer.service');
const { sendResponse } = require('../utils/responseHandler');

class BuyerController {
  async getCountries(req, res, next) {
    try {
      const countries = await buyerService.getActiveCountries();
      return sendResponse(res, 200, 'Countries retrieved successfully', { countries });
    } catch (error) {
      next(error);
    }
  }

  async selectCountry(req, res, next) {
    try {
      const { countryId } = req.body;
      const buyer = await buyerService.setExploringCountry(req.user.id, countryId);
      return sendResponse(res, 200, 'Exploring country selected successfully', { buyer });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const buyer = await buyerService.getBuyerProfile(req.user.id);
      return sendResponse(res, 200, 'Buyer profile retrieved successfully', { buyer });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BuyerController();
