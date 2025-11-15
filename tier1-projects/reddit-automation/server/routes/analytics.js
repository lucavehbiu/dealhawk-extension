const express = require('express');
const router = express.Router();

// Mock analytics data
const analytics = {
  totalComments: 0,
  totalUpvotes: 0,
  totalReplies: 0,
  avgEngagementRate: 0
};

// Get overall analytics
router.get('/', (req, res) => {
  res.json(analytics);
});

// Get campaign analytics
router.get('/campaign/:id', (req, res) => {
  // This would fetch real analytics from DB
  res.json({
    campaignId: req.params.id,
    commentsPosted: 12,
    avgUpvotes: 8.5,
    totalUpvotes: 102,
    replies: 15,
    clicks: 45,
    conversionRate: 3.2
  });
});

module.exports = router;
