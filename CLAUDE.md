# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DealHawk is a Chrome Extension (Manifest V3) that automates finding Lego arbitrage opportunities by scraping Lego.com for retiring sets and comparing prices across Amazon, Walmart, and Target.

## Development Commands

### Setup
```bash
./setup.sh  # Creates placeholder icons using ImageMagick or base64
```

### Development Workflow
This is a pure vanilla JavaScript Chrome extension with **no build step required**:

1. Edit source files directly
2. Navigate to `chrome://extensions/`
3. Click the refresh icon on the DealHawk extension
4. Test your changes

No npm install, no webpack, no compilation needed.

### Debugging
- **Service Worker**: `chrome://extensions/` → Click "Service worker" link under extension
- **Popup UI**: Right-click extension icon → Click "Inspect"
- **Console Logs**: Service worker logs to its console, popup logs to popup console

### Testing
Currently no automated testing framework. Manual testing approach:
- Mock data is built into `/utils/lego-scraper.js` (returns 5 example sets when scraping fails)
- Use Chrome DevTools for debugging
- Service worker includes extensive console logging

## Architecture Overview

### High-Level Component Flow

```
SERVICE WORKER (runs every 30 min via chrome.alarms)
    ↓
LEGO SCRAPER → Fetch Lego.com "Last Chance" page
    ↓
For each retiring set:
    RETAILER CHECKER → Check Amazon, Walmart, Target prices concurrently
    ↓
Calculate discount % (MSRP vs retailer price)
    ↓
If discount ≥ threshold:
    STORAGE MANAGER → Save opportunity
    ↓
Send browser notifications (top 3 deals)
    ↓
POPUP UI → Display opportunities to user
```

### Key Architectural Patterns

**Service Worker-based (Manifest V3)**
- Background logic runs in `/background/service-worker.js`
- Uses `chrome.alarms` API for periodic execution
- Message passing between popup and service worker via `chrome.runtime.sendMessage`

**Class-based Static Utilities**
- All utilities are static classes (no instantiation)
- `LegoScraper`, `RetailerChecker`, `StorageManager`
- ES6 modules with import/export

**Multi-Strategy Web Scraping**
Scrapers attempt multiple parsing strategies in order:
1. JSON-LD structured data: `<script type="application/ld+json">`
2. Data attributes: `data-product="..."`
3. Next.js embedded data: `__NEXT_DATA__`
4. Fallback to mock data if all fail

**Parallel Retailer Checking**
```javascript
// All retailers checked concurrently
await Promise.allSettled([
  checkAmazon(set),
  checkWalmart(set),
  checkTarget(set)
]);
```

**Chrome Storage Abstraction**
- All storage operations through `StorageManager` class
- Namespaced keys to avoid conflicts: `dealhawk_settings`, `dealhawk_opportunities`
- Maximum 100 opportunities stored (auto-deduplication by setId + retailer)

## Key Files & Responsibilities

### Service Worker
- `/background/service-worker.js` - Main orchestration, alarm management, notification system

### Business Logic
- `/utils/lego-scraper.js` - Scrapes Lego.com for retiring sets using multiple strategies
- `/utils/retailer-checker.js` - Checks prices on Amazon, Walmart, Target
- `/utils/storage.js` - Chrome storage abstraction layer

### User Interface
- `/popup/popup.html` - Tab-based UI structure (Opportunities, Settings)
- `/popup/popup.css` - Modern gradient styling
- `/popup/popup.js` - UI logic, event handlers, data display

### Configuration
- `/manifest.json` - Extension manifest (Manifest V3)
- `/privacy.html` - Privacy policy (Chrome Web Store requirement)

## Important Data Models

### Settings Object
```javascript
{
  enabled: boolean,
  scrapeInterval: number,      // minutes (default: 30)
  priceThreshold: number,      // percentage (default: 20)
  notificationsEnabled: boolean,
  retailers: {
    amazon: boolean,
    walmart: boolean,
    target: boolean
  }
}
```

### Opportunity Object
```javascript
{
  setId: string,              // Lego set ID
  setName: string,
  setNumber: string,
  msrp: number,
  retailer: string,           // 'amazon', 'walmart', or 'target'
  retailerPrice: number,
  retailerUrl: string,
  discount: string,           // e.g., "25%"
  potentialProfit: string,    // estimated $ profit
  timestamp: number           // epoch milliseconds
}
```

## Scraping Implementation Notes

### Lego.com Scraping
- Target URL: `https://www.lego.com/en-us/categories/last-chance-to-buy`
- Uses `fetch()` with CORS (works because extension has host permissions)
- Parses HTML to extract retiring set URLs
- Fetches individual set pages to get MSRP and details
- **Note**: Lego changed URL from `/last-chance` to `/last-chance-to-buy` - monitor for future changes

### Retailer Scraping
Each retailer requires different parsing strategies due to varying page structures:

**Amazon**
- Search by set number + "lego"
- Parse JSON-LD or data attributes
- Handles "Buy Box" vs third-party sellers

**Walmart**
- Search URL pattern
- Attempts JSON-LD, then data attributes
- Falls back to price class selectors

**Target**
- Search endpoint
- Parses embedded JSON data or structured data
- Extracts price from various possible locations

**Important**: Retailer websites change frequently. If scraping breaks, the scrapers will need updates to parsing logic.

## Extension Permissions

Defined in `manifest.json`:
- `storage` - Save settings and opportunities
- `alarms` - Periodic scraping
- `notifications` - Desktop alerts
- Host permissions for Lego.com, Amazon, Walmart, Target

**Important**: The service worker must be declared with `"type": "module"` in manifest.json to support ES6 imports:
```json
"background": {
  "service_worker": "background/service-worker.js",
  "type": "module"
}
```

## Documentation

Comprehensive documentation exists in `/Documentation/`:
- **README.md** - User guide, features, installation, troubleshooting
- **QUICKSTART.md** - 5-minute setup walkthrough
- **TECHNICAL.md** - Deep architecture documentation, future enhancements (Best Buy GraphQL, eBay integration)

Always read TECHNICAL.md for detailed architectural decisions and planned features.

## Coding Conventions

**ES6 Modules**: All files use import/export syntax

**Async/Await**: Consistent async/await pattern throughout, no callbacks

**Error Handling**: Try/catch blocks everywhere with graceful fallbacks

**Defensive Programming**: Promise.allSettled used to avoid failing on partial errors

**Message Passing**:
```javascript
// Popup → Service Worker
chrome.runtime.sendMessage({ action: 'manualScrape' }, response => {...});

// Service Worker listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'manualScrape') {
    // Handle async work
    handleRequest().then(sendResponse);
    return true; // Keep channel open for async response
  }
});
```

## Common Modifications

### Adding a New Retailer
1. Add scraping logic to `/utils/retailer-checker.js`
2. Add retailer to settings UI in `/popup/popup.html`
3. Update settings model in `/utils/storage.js`
4. Add host permission to `/manifest.json`

### Changing Scrape Interval
- Default is 30 minutes (managed via `chrome.alarms`)
- User configurable in Settings tab
- Stored in chrome.storage.local

### Modifying Discount Threshold
- Default is 20% discount
- User configurable in Settings tab
- Logic in `/background/service-worker.js` filters opportunities based on threshold

## Known Limitations

1. **No Build Process**: Intentionally simple but means no TypeScript, no bundling
2. **Web Scraping Fragility**: Retailer websites change frequently, breaking scrapers
3. **No Automated Tests**: Manual testing only
4. **CORS Reliance**: Depends on Chrome extension host permissions for cross-origin requests
5. **Storage Limit**: Chrome storage.local has 5MB limit (currently not an issue)
6. **Scraping Rate**: 30-minute intervals to avoid rate limiting/detection

## Future Enhancement Ideas (from TECHNICAL.md)

- **Best Buy Integration**: GraphQL endpoint documented in TECHNICAL.md
- **eBay Sold Listings**: For actual profit data vs estimated
- **Price History Tracking**: Trend analysis
- **ML Price Prediction**: Historical data → future price predictions
- **Mobile Companion App**: React Native version
