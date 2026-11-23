const db = require('../models');
const CustomError = require('../utils/CustomError');
const { Country, Buyer, User } = db;

/**
 * Get list of active countries for dropdowns and country selection screen
 */
const getActiveCountries = async () => {
  return await Country.findAll({
    where: { isActive: true },
    order: [['name', 'ASC']]
  });
};

/**
 * Save or update Buyer's selected exploration country
 */
const setExploringCountry = async (userId, countryId) => {
  const country = await Country.findOne({ where: { id: countryId, isActive: true } });
  if (!country) {
    throw new CustomError('Selected country is invalid or inactive', 400);
  }

  let buyer = await Buyer.findOne({ where: { userId } });
  if (!buyer) {
    buyer = await Buyer.create({ userId, countryId });
  } else {
    await buyer.update({ countryId });
  }

  return await Buyer.findOne({
    where: { userId },
    include: [{ model: Country, as: 'exploringCountry' }]
  });
};

/**
 * Get Buyer profile
 */
const getBuyerProfile = async (userId) => {
  const buyer = await Buyer.findOne({
    where: { userId },
    include: [
      { model: User, as: 'user', attributes: { exclude: ['password'] } },
      { model: Country, as: 'exploringCountry' }
    ]
  });

  if (!buyer) {
    throw new CustomError('Buyer profile not found', 404);
  }

  return buyer;
};

module.exports = {
  getActiveCountries,
  setExploringCountry,
  getBuyerProfile
};
