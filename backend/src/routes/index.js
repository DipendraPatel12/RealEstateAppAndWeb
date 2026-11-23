const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const buyerRoutes = require('./buyer.routes');
const agentRoutes = require('./agent.routes');

router.use('/auth', authRoutes);
router.use('/buyer', buyerRoutes);
router.use('/agent', agentRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
