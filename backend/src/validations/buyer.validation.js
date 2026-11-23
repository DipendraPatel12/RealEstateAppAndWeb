const Joi = require('joi');

const selectCountrySchema = Joi.object({
  countryId: Joi.number().integer().positive().required().messages({
    'number.base': 'countryId must be a valid integer',
    'any.required': 'countryId is required'
  })
});

module.exports = {
  selectCountrySchema
};
