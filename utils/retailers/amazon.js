/**
 * Amazon Price Checker
 */

export class AmazonChecker {
  /**
   * Check Amazon for the set
   */
  static async checkPrice(legoSet) {
    try {
      // Amazon search URL for the specific Lego set number
      const searchUrl = `https://www.amazon.com/s?k=lego+${encodeURIComponent(legoSet.setNumber)}`;

      const response = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });

      if (!response.ok) {
        return { available: false, error: `Failed to fetch (HTTP ${response.status})` };
      }

      const html = await response.text();

      // Check if we hit a bot detection page
      if (html.includes('api-services-support@amazon.com') || html.includes('To discuss automated access')) {
        return { available: false, reason: 'Bot detection (try manual search)', blocked: true };
      }

      // Parse Amazon's search results
      // Amazon uses multiple price formats, try them all
      let priceMatch = null;
      let price = null;

      // Try various price patterns
      const pricePatterns = [
        /"priceAmount":(\d+\.\d{2})/,           // JSON price in HTML
        /\$(\d+\.\d{2})/,                        // Standard $XX.XX
        /"price":\s*"(\d+\.\d{2})"/,            // JSON "price": "XX.XX"
        /a-price-whole">(\d+)<.*?a-price-fraction">(\d+)/s,  // Separate whole/fraction
        /\$<span[^>]*>(\d+)<\/span><span[^>]*>\.(\d+)/  // Span-wrapped price
      ];

      for (const pattern of pricePatterns) {
        priceMatch = html.match(pattern);
        if (priceMatch) {
          if (priceMatch.length === 3) {
            // Separate whole and fraction parts
            price = parseFloat(`${priceMatch[1]}.${priceMatch[2]}`);
          } else {
            price = parseFloat(priceMatch[1]);
          }
          break;
        }
      }

      const asinMatch = html.match(/data-asin="([A-Z0-9]{10})"/);

      if (price && asinMatch) {
        const asin = asinMatch[1];

        return {
          available: true,
          price: price,
          url: `https://www.amazon.com/dp/${asin}`,
          inStock: !html.includes('Currently unavailable')
        };
      }

      return { available: false, reason: 'Not found on Amazon' };

    } catch (error) {
      console.error('Amazon check error:', error);
      return { available: false, error: error.message };
    }
  }
}
