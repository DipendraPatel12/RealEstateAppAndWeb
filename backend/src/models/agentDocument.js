'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AgentDocument extends Model {
    static associate(models) {
      AgentDocument.belongsTo(models.AgentProfile, { foreignKey: 'agentProfileId', as: 'profile' });
    }
  }

  AgentDocument.init({
    agentProfileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'agent_profiles', key: 'id' }
    },
    documentType: {
      type: DataTypes.ENUM('Driving_License', 'Passport', 'PAN_Card', 'Profile_Photo'),
      allowNull: false
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    fileSizeMb: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
    rejectionReason: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AgentDocument',
    tableName: 'agent_documents',
    timestamps: true
  });

  return AgentDocument;
};
