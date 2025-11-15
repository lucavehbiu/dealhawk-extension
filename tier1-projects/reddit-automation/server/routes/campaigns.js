const express = require('express');
const router = express.Router();
const redditService = require('../services/redditService');
const aiService = require('../services/aiService');

// Mock database (replace with MongoDB in production)
let campaigns = [];
let comments = [];

// Get all campaigns
router.get('/', (req, res) => {
  res.json(campaigns);
});

// Create new campaign
router.post('/', (req, res) => {
  const campaign = {
    id: Date.now().toString(),
    createdAt: new Date(),
    active: true,
    ...req.body
  };

  campaigns.push(campaign);
  res.json(campaign);
});

// Update campaign
router.put('/:id', (req, res) => {
  const index = campaigns.findIndex(c => c.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  campaigns[index] = { ...campaigns[index], ...req.body };
  res.json(campaigns[index]);
});

// Delete campaign
router.delete('/:id', (req, res) => {
  campaigns = campaigns.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// Test campaign (find relevant posts and generate comments WITHOUT posting)
router.post('/:id/test', async (req, res) => {
  const campaign = campaigns.find(c => c.id === req.params.id);

  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  try {
    // Find relevant posts
    const posts = await redditService.findRelevantPosts(
      campaign.subreddits,
      campaign.keywords,
      5
    );

    // Generate comments for each
    const results = [];
    for (const post of posts) {
      const postDetails = await redditService.getPostDetails(post.id);

      // Analyze relevance
      const analysis = await aiService.analyzeRelevance(postDetails, campaign);

      if (analysis.relevant && analysis.relevanceScore >= 70) {
        // Generate comment
        const aiResult = await aiService.generateComment(postDetails, campaign);

        results.push({
          post: postDetails,
          analysis,
          generatedComment: aiResult.comment,
          willPost: analysis.recommendMention
        });
      }
    }

    res.json({
      campaignId: campaign.id,
      postsAnalyzed: posts.length,
      relevantPosts: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run campaign (actually post comments)
router.post('/:id/run', async (req, res) => {
  const campaign = campaigns.find(c => c.id === req.params.id);

  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  if (!campaign.active) {
    return res.status(400).json({ error: 'Campaign is not active' });
  }

  try {
    // Find relevant posts
    const posts = await redditService.findRelevantPosts(
      campaign.subreddits,
      campaign.keywords,
      campaign.maxCommentsPerRun || 5
    );

    const results = [];

    for (const post of posts) {
      // Check if already commented
      const hasCommented = await redditService.hasCommented(
        post.id,
        process.env.REDDIT_USERNAME
      );

      if (hasCommented) {
        continue;
      }

      const postDetails = await redditService.getPostDetails(post.id);

      // Analyze relevance
      const analysis = await aiService.analyzeRelevance(postDetails, campaign);

      if (analysis.relevant && analysis.relevanceScore >= campaign.minRelevanceScore) {
        // Generate comment
        const aiResult = await aiService.generateComment(postDetails, campaign);

        if (aiResult.success && analysis.recommendMention) {
          // Post the comment
          const postResult = await redditService.postComment(
            post.id,
            aiResult.comment
          );

          if (postResult.success) {
            const commentRecord = {
              id: Date.now().toString(),
              campaignId: campaign.id,
              postId: post.id,
              postUrl: postDetails.url,
              comment: aiResult.comment,
              postedAt: new Date(),
              commentUrl: postResult.permalink
            };

            comments.push(commentRecord);

            results.push({
              success: true,
              post: postDetails,
              comment: commentRecord
            });
          }
        }
      }

      // Rate limiting (wait 30 seconds between comments)
      await new Promise(resolve => setTimeout(resolve, 30000));
    }

    res.json({
      campaignId: campaign.id,
      postsAnalyzed: posts.length,
      commentsPosted: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all comments for a campaign
router.get('/:id/comments', (req, res) => {
  const campaignComments = comments.filter(c => c.campaignId === req.params.id);
  res.json(campaignComments);
});

module.exports = router;
