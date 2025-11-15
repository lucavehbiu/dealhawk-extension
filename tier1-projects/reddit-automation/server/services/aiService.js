const Anthropic = require('@anthropic-ai/sdk');

class AIService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  /**
   * Generate a helpful Reddit comment using Claude
   * @param {Object} post - Reddit post details
   * @param {Object} campaign - Campaign settings (product info, tone, etc.)
   */
  async generateComment(post, campaign) {
    const prompt = this.buildPrompt(post, campaign);

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const comment = message.content[0].text;

      return {
        success: true,
        comment,
        tokens: message.usage.input_tokens + message.usage.output_tokens
      };
    } catch (error) {
      console.error('AI generation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Build the prompt for Claude
   */
  buildPrompt(post, campaign) {
    return `You are helping a founder of "${campaign.productName}" engage authentically on Reddit.

PRODUCT INFO:
Name: ${campaign.productName}
Description: ${campaign.productDescription}
URL: ${campaign.productUrl}

REDDIT POST:
Subreddit: r/${post.subreddit}
Title: ${post.title}
Body: ${post.selftext}

INSTRUCTIONS:
1. Write a genuinely helpful comment that addresses the user's question/problem
2. DO NOT be salesy or promotional
3. Only mention the product if it's TRULY relevant and helpful
4. If mentioned, do it naturally like: "I've been using [product] for this and it works well because..."
5. Prioritize being helpful over promoting
6. Match the tone of the subreddit (casual, friendly, professional as needed)
7. Keep it concise (2-3 paragraphs max)
8. Sound like a real human, not a bot

TONE: ${campaign.tone || 'Friendly and helpful'}

Write a comment that would get upvotes for being genuinely useful:`;
  }

  /**
   * Analyze if a post is relevant for commenting
   * @param {Object} post - Reddit post details
   * @param {Object} campaign - Campaign settings
   */
  async analyzeRelevance(post, campaign) {
    const prompt = `Analyze if this Reddit post is relevant for mentioning "${campaign.productName}".

PRODUCT:
${campaign.productDescription}

POST:
Title: ${post.title}
Body: ${post.selftext}

Respond with ONLY a JSON object:
{
  "relevant": true/false,
  "relevanceScore": 0-100,
  "reason": "brief explanation",
  "recommendMention": true/false
}

Consider:
- Is the user asking about a problem your product solves?
- Would mentioning the product be helpful (not spammy)?
- Is this a good opportunity for authentic engagement?`;

    try {
      const message = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const response = message.content[0].text;
      const analysis = JSON.parse(response);

      return analysis;
    } catch (error) {
      console.error('Relevance analysis error:', error);
      return {
        relevant: false,
        relevanceScore: 0,
        reason: 'Analysis failed',
        recommendMention: false
      };
    }
  }
}

module.exports = new AIService();
