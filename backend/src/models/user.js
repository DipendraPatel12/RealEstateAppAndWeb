'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    fullName: { type: DataTypes.STRING, allowNull: false },

    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: false, unique: true },
    is_email_varified: { type: DataTypes.BOOLEAN, allowNull: false },
    user_Status: { type: DataTypes.ENUM("ACTIVE", "INACTIVE", "BLOCKED"), allowNull: false },
    role: { type: DataTypes.ENUM("ADMIN", "AGENT", "BUYER", "OWNER", "DEVELOPER"), allowNull: false }

  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};