'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Buyer extends Model {
    static associate(models) {
      Buyer.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Buyer.belongsTo(models.Country, { foreignKey: 'countryId', as: 'exploringCountry' });
    }
  }

  Buyer.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'Users', key: 'id' }
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'countries', key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'Buyer',
    tableName: 'buyers',
    timestamps: true
  });

  return Buyer;
};
