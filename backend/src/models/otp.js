'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    static associate(models) {
      OTP.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  OTP.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    },
    identifier: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    otpCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(
        'EMAIL_VERIFICATION',
        'PHONE_VERIFICATION',
        'PASSWORD_RESET',
        'LOGIN_2FA'
      ),
      allowNull: false
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    maxAttempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OTP',
    tableName: 'otps',
    timestamps: true
  });

  return OTP;
};
