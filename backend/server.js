require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDb = require('./src/config/database');
const apiRoutes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');
const CustomError = require('./src/utils/CustomError');

const app = express();
const port = process.env.PORT || 5000;

// Connect to Database
connectDb();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or web frontends
    callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// API Routes
app.use('/api/v1', apiRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Real Estate API',
    version: '1.0.0',
    documentation: '/api/v1/health'
  });
});

// Handle unhandled routes (404)
app.use((req, res, next) => {
  next(new CustomError(`Endpoint ${req.originalUrl} not found`, 404));
});

// Centralized Error Handler
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
});

module.exports = { app, server };
