const express = require('express');
const { shopifyApp } = require('@shopify/shopify-app-express');
const { ApiVersion } = require('@shopify/shopify-api');
const http = require('http');
const socketIO = require('socket.io');
const redis = require('redis');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Redis client for tracking views
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect();

// Shopify App setup
const shopify = shopifyApp({
  api: {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: process.env.SHOPIFY_SCOPES.split(','),
    hostScheme: 'https',
    hostName: process.env.SHOPIFY_APP_URL.replace('https://', ''),
    apiVersion: ApiVersion.October23
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback'
  },
  webhooks: {
    path: '/api/webhooks'
  }
});

app.use(express.json());

// Shopify app routes
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(shopify.config.auth.callbackPath, shopify.auth.callback(), (req, res) => {
  res.redirect('/');
});

// App dashboard
app.get('/', shopify.ensureInstalledOnShop(), async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>View Counter - Dashboard</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          background: #f5f7fa;
        }
        .header {
          background: linear-gradient(135deg, #5c6ac4 0%, #7c87d8 100%);
          color: white;
          padding: 40px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
        }
        .card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .stat {
          display: inline-block;
          padding: 20px 30px;
          margin: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          text-align: center;
        }
        .stat-value {
          font-size: 32px;
          font-weight: 600;
          color: #5c6ac4;
        }
        .stat-label {
          color: #666;
          font-size: 14px;
        }
        .btn {
          background: #5c6ac4;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn:hover {
          background: #4c5ab5;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>👁️ Product View Counter</h1>
        <p>Real-time social proof for your store</p>
      </div>

      <div class="card">
        <h2>📊 Today's Stats</h2>
        <div class="stat">
          <div class="stat-value">0</div>
          <div class="stat-label">Total Views</div>
        </div>
        <div class="stat">
          <div class="stat-value">0</div>
          <div class="stat-label">Active Viewers</div>
        </div>
        <div class="stat">
          <div class="stat-value">0</div>
          <div class="stat-label">Products Tracked</div>
        </div>
      </div>

      <div class="card">
        <h2>⚙️ Settings</h2>
        <p>Customize how view counts appear on your store</p>
        <button class="btn">Configure Display</button>
      </div>

      <div class="card">
        <h2>📈 Top Viewed Products</h2>
        <p>Coming soon...</p>
      </div>
    </body>
    </html>
  `);
});

// API endpoint to track product view
app.post('/api/track-view', async (req, res) => {
  const { shop, productId, sessionId } = req.body;

  if (!shop || !productId || !sessionId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const key = `views:${shop}:${productId}`;
  const sessionKey = `session:${sessionId}:${productId}`;

  try {
    // Check if this session has already viewed this product recently (within 5 minutes)
    const recentView = await redisClient.get(sessionKey);

    if (!recentView) {
      // Increment view count
      await redisClient.incr(key);

      // Mark this session as having viewed (expires in 5 minutes)
      await redisClient.setEx(sessionKey, 300, '1');

      // Add to active viewers set (expires in 2 minutes)
      await redisClient.zAdd(`active:${shop}:${productId}`, {
        score: Date.now(),
        value: sessionId
      });

      // Broadcast update via WebSocket
      io.to(`${shop}:${productId}`).emit('viewUpdate', {
        productId,
        totalViews: await getCurrentViews(shop, productId),
        activeViewers: await getActiveViewers(shop, productId)
      });
    }

    res.json({
      success: true,
      totalViews: await getCurrentViews(shop, productId),
      activeViewers: await getActiveViewers(shop, productId)
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Get current view count for a product
app.get('/api/views/:shop/:productId', async (req, res) => {
  const { shop, productId } = req.params;

  const totalViews = await getCurrentViews(shop, productId);
  const activeViewers = await getActiveViewers(shop, productId);

  res.json({
    productId,
    totalViews,
    activeViewers
  });
});

// WebSocket connection for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('joinProduct', ({ shop, productId }) => {
    const room = `${shop}:${productId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Helper functions
async function getCurrentViews(shop, productId) {
  const key = `views:${shop}:${productId}`;
  const views = await redisClient.get(key);
  return parseInt(views || '0');
}

async function getActiveViewers(shop, productId) {
  const key = `active:${shop}:${productId}`;

  // Remove old entries (older than 2 minutes)
  const twoMinutesAgo = Date.now() - (2 * 60 * 1000);
  await redisClient.zRemRangeByScore(key, 0, twoMinutesAgo);

  // Count remaining active viewers
  const count = await redisClient.zCard(key);
  return count;
}

// Cleanup job (runs every minute)
setInterval(async () => {
  console.log('Running cleanup...');
  // Additional cleanup logic here
}, 60 * 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Shopify View Counter running on port ${PORT}`);
  console.log(`📝 App URL: ${process.env.SHOPIFY_APP_URL}`);
});
