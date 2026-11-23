'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const countries = [
      {
        name: 'United Arab Emirates',
        isoCode: 'AE',
        dialCode: '+971',
        currencyCode: 'AED',
        currencySymbol: 'AED',
        flagUrl: 'https://flagcdn.com/w40/ae.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Singapore',
        isoCode: 'SG',
        dialCode: '+65',
        currencyCode: 'SGD',
        currencySymbol: 'S$',
        flagUrl: 'https://flagcdn.com/w40/sg.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'United States',
        isoCode: 'US',
        dialCode: '+1',
        currencyCode: 'USD',
        currencySymbol: '$',
        flagUrl: 'https://flagcdn.com/w40/us.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'United Kingdom',
        isoCode: 'GB',
        dialCode: '+44',
        currencyCode: 'GBP',
        currencySymbol: '£',
        flagUrl: 'https://flagcdn.com/w40/gb.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'India',
        isoCode: 'IN',
        dialCode: '+91',
        currencyCode: 'INR',
        currencySymbol: '₹',
        flagUrl: 'https://flagcdn.com/w40/in.png',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('countries', countries, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('countries', null, {});
  }
};
