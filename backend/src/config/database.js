const db = require('../models');

const connectDb = async () => {
    try {
        // 1. Authenticate connection with MySQL
        await db.sequelize.authenticate();
        console.log('Database connected successfully.');

    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDb;