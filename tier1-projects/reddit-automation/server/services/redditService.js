const snoowrap = require('snoowrap');

class RedditService {
  constructor() {
    this.reddit = new snoowrap({
      userAgent: 'RedditCommentAutomation/1.0.0',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: process.env.REDDIT_REFRESH_TOKEN
    });
  }

  /**
   * Search for relevant posts in subreddits
   * @param {Array} subreddits - List of subreddit names
   * @param {Array} keywords - Keywords to search for
   * @param {number} limit - Number of posts to fetch
   */
  async findRelevantPosts(subreddits, keywords, limit = 10) {
    const posts = [];

    for (const subreddit of subreddits) {
      try {
        // Search for each keyword
        for (const keyword of keywords) {
          const searchResults = await this.reddit
            .getSubreddit(subreddit)
            .search({
              query: keyword,
              time: 'day', // Posts from last 24 hours
              sort: 'hot',
              limit: 5
            });

          posts.push(...searchResults);
        }

        // Also get new posts
        const newPosts = await this.reddit
          .getSubreddit(subreddit)
          .getNew({ limit: 10 });

        // Filter for relevant posts
        const relevantNew = newPosts.filter(post =>
          keywords.some(kw =>
            post.title.toLowerCase().includes(kw.toLowerCase()) ||
            post.selftext.toLowerCase().includes(kw.toLowerCase())
          )
        );

        posts.push(...relevantNew);
      } catch (error) {
        console.error(`Error fetching from r/${subreddit}:`, error.message);
      }
    }

    // Remove duplicates
    const uniquePosts = Array.from(
      new Map(posts.map(post => [post.id, post])).values()
    );

    // Sort by created time (newest first)
    return uniquePosts
      .sort((a, b) => b.created_utc - a.created_utc)
      .slice(0, limit);
  }

  /**
   * Post a comment to Reddit
   * @param {string} postId - Reddit post ID
   * @param {string} comment - Comment text
   */
  async postComment(postId, comment) {
    try {
      const submission = await this.reddit.getSubmission(postId);
      const reply = await submission.reply(comment);
      return {
        success: true,
        commentId: reply.id,
        permalink: `https://reddit.com${reply.permalink}`
      };
    } catch (error) {
      console.error('Error posting comment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if we've already commented on a post
   * @param {string} postId - Reddit post ID
   * @param {string} username - Reddit username to check
   */
  async hasCommented(postId, username) {
    try {
      const submission = await this.reddit.getSubmission(postId);
      const comments = await submission.comments;

      const flatten = (comment) => {
        const replies = comment.replies || [];
        return [comment, ...replies.flatMap(flatten)];
      };

      const allComments = comments.flatMap(flatten);

      return allComments.some(
        comment => comment.author && comment.author.name === username
      );
    } catch (error) {
      console.error('Error checking comments:', error);
      return false;
    }
  }

  /**
   * Get post details including title, body, and top comments
   * @param {string} postId - Reddit post ID
   */
  async getPostDetails(postId) {
    try {
      const submission = await this.reddit.getSubmission(postId);
      return {
        id: submission.id,
        title: submission.title,
        selftext: submission.selftext,
        subreddit: submission.subreddit.display_name,
        author: submission.author.name,
        score: submission.score,
        numComments: submission.num_comments,
        created: new Date(submission.created_utc * 1000),
        url: `https://reddit.com${submission.permalink}`
      };
    } catch (error) {
      console.error('Error getting post details:', error);
      return null;
    }
  }
}

module.exports = new RedditService();
