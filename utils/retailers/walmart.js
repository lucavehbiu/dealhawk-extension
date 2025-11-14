/**
 * Walmart Price Checker
 */

export class WalmartChecker {
  /**
   * Check Walmart for the set
   */
  static async checkPrice(legoSet) {
    try {
      // Walmart search URL
      const searchUrl = `https://www.walmart.com/search?q=lego+${encodeURIComponent(legoSet.setNumber)}`;

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

      // Check for bot detection (Walmart often returns minimal HTML when blocking)
      if (html.length < 20000 || html.includes('Please confirm that you are not a robot') || html.includes('Request blocked')) {
        return { available: false, reason: 'Bot detection', blocked: true };
      }

      // Try multiple Walmart data extraction methods

      // Method 1: __NEXT_DATA__
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (nextDataMatch) {
        try {
          const data = JSON.parse(nextDataMatch[1]);

          // Navigate Walmart's data structure (they use multiple possible paths)
          const searchResults =
            data.props?.pageProps?.initialData?.searchResult?.itemStacks?.[0]?.items ||
            data.props?.pageProps?.initialData?.searchResult?.items;

          if (searchResults && searchResults.length > 0) {
            for (const item of searchResults.slice(0, 5)) {
              const itemName = item.name || item.title || '';

              // Check if set number matches (case insensitive)
              if (itemName.toLowerCase().includes(legoSet.setNumber.toLowerCase())) {
                const price = parseFloat(
                  item.priceInfo?.currentPrice?.price ||
                  item.price ||
                  item.priceInfo?.linePrice ||
                  0
                );

                if (price > 0) {
                  return {
                    available: true,
                    price: price,
                    url: item.canonicalUrl ? `https://www.walmart.com${item.canonicalUrl}` : `https://www.walmart.com/ip/${item.usItemId}`,
                    inStock: item.availabilityStatus === 'IN_STOCK' || item.availabilityStatusV2?.value === 'IN_STOCK'
                  };
                }
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse Walmart __NEXT_DATA__:', e);
        }
      }

      // Method 2: Simple price regex fallback
      const pricePatterns = [
        /"price":"(\d+\.\d{2})"/,
        /"currentPrice":{"price":(\d+\.\d{2})/,
        /\$(\d+\.\d{2})/
      ];

      for (const pattern of pricePatterns) {
        const match = html.match(pattern);
        if (match && html.toLowerCase().includes(legoSet.setNumber.toLowerCase())) {
          const price = parseFloat(match[1]);
          // Try to find product URL
          const urlMatch = html.match(/\/ip\/[^"]+/);
          return {
            available: true,
            price: price,
            url: urlMatch ? `https://www.walmart.com${urlMatch[0]}` : searchUrl,
            inStock: true
          };
        }
      }

      return { available: false, reason: 'Not found on Walmart' };

    } catch (error) {
      console.error('Walmart check error:', error);
      return { available: false, error: error.message };
    }
  }
}
