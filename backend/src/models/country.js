'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    static associate(models) {
      Country.hasMany(models.Buyer, { foreignKey: 'countryId', as: 'buyers' });
    }
  }

  Country.init({
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    isoCode: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true
    },
    dialCode: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    currencyCode: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    currencySymbol: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: '$'
    },
    flagUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Country',
    tableName: 'countries',
    timestamps: true
  });

  return Country;
};
