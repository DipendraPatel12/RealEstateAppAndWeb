'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AgentProfile extends Model {
    static associate(models) {
      AgentProfile.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      AgentProfile.belongsTo(models.User, { foreignKey: 'reviewedBy', as: 'reviewer' });
      AgentProfile.hasMany(models.AgentDocument, { foreignKey: 'agentProfileId', as: 'documents', onDelete: 'CASCADE' });
    }
  }

  AgentProfile.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: 'Users', key: 'id' }
    },
    agencyName: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    roleType: {
      type: DataTypes.ENUM('Individual', 'Agency'),
      allowNull: true
    },
    licenseNumber: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    experienceLevel: {
      type: DataTypes.ENUM('0-2', '3-5', '6-10', '10+'),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    onboardingStep: {
      type: DataTypes.ENUM('EMAIL_VERIFIED', 'PROFESSIONAL_INFO', 'DOCUMENTS_UPLOADED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'EMAIL_VERIFIED'
    },
    kycStatus: {
      type: DataTypes.ENUM('NOT_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'NOT_SUBMITTED'
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' }
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AgentProfile',
    tableName: 'agent_profiles',
    timestamps: true
  });

  return AgentProfile;
};
