/**
 * Target Price Checker
 */

export class TargetChecker {
  /**
   * Check Target for the set
   */
  static async checkPrice(legoSet) {
    try {
      // Target search URL
      const searchUrl = `https://www.target.com/s?searchTerm=lego+${encodeURIComponent(legoSet.setNumber)}`;

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

      // Check for bot detection (Target returns ~180KB access denied page)
      if (html.includes('blocked') || html.includes('Access Denied') || html.includes('security challenge')) {
        return { available: false, reason: 'Bot detection', blocked: true };
      }

      // Try multiple Target data extraction methods

      // Method 1: __NEXT_DATA__ (Target now uses Next.js)
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);
      if (nextDataMatch) {
        try {
          const data = JSON.parse(nextDataMatch[1]);

          // Navigate Target's Next.js data structure
          const searchResults =
            data.props?.pageProps?.initialData?.searchResponse?.products ||
            data.props?.pageProps?.data?.search?.products;

          if (searchResults && searchResults.length > 0) {
            for (const product of searchResults.slice(0, 5)) {
              const title = product.item?.product_description?.title || product.title || '';

              // Check if set number matches (case insensitive)
              if (title.toLowerCase().includes(legoSet.setNumber.toLowerCase())) {
                const price = parseFloat(
                  product.price?.current_retail ||
                  product.price?.reg_retail ||
                  product.item?.price?.current_retail ||
                  0
                );

                if (price > 0) {
                  const tcin = product.tcin || product.item?.tcin;
                  return {
                    available: true,
                    price: price,
                    url: product.url ? `https://www.target.com${product.url}` : `https://www.target.com/p/-/A-${tcin}`,
                    inStock: product.availability !== 'OUT_OF_STOCK'
                  };
                }
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse Target __NEXT_DATA__:', e);
        }
      }

      // Method 2: __TGT_DATA__ (older Target format)
      const tgtDataMatch = html.match(/__TGT_DATA__\s*=\s*({.*?});\s*<\/script>/s);
      if (tgtDataMatch) {
        try {
          const data = JSON.parse(tgtDataMatch[1]);
          const products = data.products || [];

          for (const product of products) {
            const title = product.title || '';
            if (title.toLowerCase().includes(legoSet.setNumber.toLowerCase())) {
              const price = parseFloat(product.price?.current || product.price?.reg_retail || 0);
              if (price > 0) {
                return {
                  available: true,
                  price: price,
                  url: `https://www.target.com${product.url}`,
                  inStock: product.availability !== 'OUT_OF_STOCK'
                };
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse Target __TGT_DATA__:', e);
        }
      }

      // Method 3: Price regex fallback
      const pricePatterns = [
        /"current_retail":(\d+\.\d{2})/,
        /"price":\s*{\s*"current":\s*(\d+\.\d{2})/,
        /\$(\d+\.\d{2})/
      ];

      for (const pattern of pricePatterns) {
        const match = html.match(pattern);
        if (match && html.toLowerCase().includes(legoSet.setNumber.toLowerCase())) {
          const price = parseFloat(match[1]);
          return {
            available: true,
            price: price,
            url: searchUrl,
            inStock: true
          };
        }
      }

      return { available: false, reason: 'Not found on Target' };

    } catch (error) {
      console.error('Target check error:', error);
      return { available: false, error: error.message };
    }
  }
}
