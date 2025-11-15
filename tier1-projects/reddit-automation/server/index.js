const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const redditService = require('./services/redditService');
const aiService = require('./services/aiService');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaigns');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Run automation every hour
cron.schedule('0 * * * *', async () => {
  console.log('🤖 Running Reddit automation...');
  try {
    await runAutomation();
  } catch (error) {
    console.error('Automation error:', error);
  }
});

async function runAutomation() {
  // This would fetch all active campaigns from DB
  // and run automation for each one
  console.log('Automation logic here');
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Reddit Automation Server running on port ${PORT}`);
  console.log(`📝 Docs: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
