'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agent_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      agencyName: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      roleType: {
        type: Sequelize.ENUM('Individual', 'Agency'),
        allowNull: true
      },
      licenseNumber: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      experienceLevel: {
        type: Sequelize.ENUM('0-2', '3-5', '6-10', '10+'),
        allowNull: true
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      onboardingStep: {
        type: Sequelize.ENUM('EMAIL_VERIFIED', 'PROFESSIONAL_INFO', 'DOCUMENTS_UPLOADED', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'EMAIL_VERIFIED'
      },
      kycStatus: {
        type: Sequelize.ENUM('NOT_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'),
        allowNull: false,
        defaultValue: 'NOT_SUBMITTED'
      },
      rejectionReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      reviewedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      reviewedAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('agent_profiles');
  }
};
