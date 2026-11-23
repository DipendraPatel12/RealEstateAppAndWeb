'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agent_documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      agentProfileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'agent_profiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      documentType: {
        type: Sequelize.ENUM('Driving_License', 'Passport', 'PAN_Card', 'Profile_Photo'),
        allowNull: false
      },
      fileName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      fileUrl: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      fileSizeMb: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'PENDING'
      },
      rejectionReason: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('agent_documents');
  }
};
