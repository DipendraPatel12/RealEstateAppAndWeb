'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.RefreshToken, { foreignKey: 'userId', as: 'refreshTokens', onDelete: 'CASCADE' });
      User.hasMany(models.OTP, { foreignKey: 'userId', as: 'otps', onDelete: 'CASCADE' });
      User.hasOne(models.Buyer, { foreignKey: 'userId', as: 'buyerProfile', onDelete: 'CASCADE' });
      User.hasOne(models.AgentProfile, { foreignKey: 'userId', as: 'agentProfile', onDelete: 'CASCADE' });
    }

    // Helper to safely strip password from JSON responses
    toSafeObject() {
      const { password, ...safeUser } = this.toJSON();
      return safeUser;
    }

    // Method to check passwords
    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }
  }

  User.init({
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    is_email_varified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    user_Status: {
      type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'BLOCKED'),
      allowNull: false,
      defaultValue: 'INACTIVE'
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'AGENT', 'BUYER', 'OWNER', 'DEVELOPER'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  return User;
};
