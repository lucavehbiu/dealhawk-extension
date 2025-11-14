/**
 * Lego.com Scraper
 * Fetches retiring and sold-out sets from Lego's official website
 */

export class LegoScraper {
  static BASE_URL = 'https://www.lego.com';
  static API_ENDPOINTS = {
    // Lego uses a product API - we'll target their "Last Chance to Buy" section
    US_SHOP: 'https://www.lego.com/api/graphql/ProductAvailability',
    LAST_CHANCE: 'https://www.lego.com/en-us/categories/last-chance-to-buy'
  };

  /**
   * Get retiring Lego sets
   * @returns {Promise<Array>} Array of retiring set objects
   */
  static async getRetiringSets() {
    try {
      // Approach 1: Try to fetch the "Last Chance" page and parse it
      const response = await fetch(this.API_ENDPOINTS.LAST_CHANCE, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch Lego page: ${response.status}`);
      }

      const html = await response.text();

      // Parse the HTML to extract product data
      // Lego embeds product data in JSON-LD or data attributes
      const sets = this.parseLegoHTML(html);

      // Filter to only sets that are available at retailers (not completely sold out everywhere)
      return sets.filter(set => set.status === 'retiring_soon' || set.status === 'limited_stock');

    } catch (error) {
      console.error('LegoScraper error:', error);

      // Return mock data for testing/demo purposes
      return this.getMockRetiringSets();
    }
  }

  /**
   * Parse Lego HTML to extract product data
   */
  static parseLegoHTML(html) {
    const sets = [];

    try {
      // Look for __NEXT_DATA__ (Lego uses Next.js with Apollo Client)
      const propsRegex = /<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s;
      const propsMatch = html.match(propsRegex);

      if (propsMatch) {
        try {
          const nextData = JSON.parse(propsMatch[1]);
          const products = this.extractSetsFromNextData(nextData);
          sets.push(...products);
        } catch (e) {
          console.error('Failed to parse NEXT_DATA:', e);
        }
      }

    } catch (error) {
      console.error('Error parsing Lego HTML:', error);
    }

    return sets;
  }


  /**
   * Extract sets from Next.js data (Apollo Client state)
   */
  static extractSetsFromNextData(nextData) {
    const sets = [];

    try {
      const apolloState = nextData.props?.pageProps?.__APOLLO_STATE__;
      if (!apolloState) {
        console.error('No Apollo state found in Next.js data');
        return sets;
      }

      // Find all ProductQueryResult objects
      const productQueryKeys = Object.keys(apolloState).filter(k => k.startsWith('ProductQueryResult:'));

      for (const queryKey of productQueryKeys) {
        const queryResult = apolloState[queryKey];
        if (!queryResult.results) continue;

        // Process each product in the results
        for (const productRef of queryResult.results) {
          try {
            const product = apolloState[productRef.id];
            if (!product) continue;

            // Get the variant data
            const variant = product.variant ? apolloState[product.variant.id] : null;
            if (!variant) continue;

            // Get price data
            const priceKey = `$${product.variant.id}.price`;
            const price = apolloState[priceKey];

            // Get attributes data
            const attrKey = `$${product.variant.id}.attributes`;
            const attributes = apolloState[attrKey];

            if (!price) continue;

            sets.push({
              id: product.id,
              name: product.name,
              setNumber: product.productCode,
              msrp: price.formattedValue || (price.centAmount / 100),
              imageUrl: product.primaryImage,
              status: 'retiring_soon',
              legoUrl: `https://www.lego.com/en-us/product/${product.slug}`,
              pieceCount: attributes?.pieceCount || null,
              ageRange: attributes?.ageRange || null
            });
          } catch (error) {
            console.error('Error processing product:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error extracting from Next data:', error);
    }

    return sets;
  }

  /**
   * Mock data for testing/demo
   */
  static getMockRetiringSets() {
    return [
      {
        id: '75192',
        name: 'Millennium Falcon',
        setNumber: '75192',
        msrp: 849.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/75192_prod.jpg',
        status: 'retiring_soon',
        legoUrl: 'https://www.lego.com/en-us/product/millennium-falcon-75192'
      },
      {
        id: '10497',
        name: 'Galaxy Explorer',
        setNumber: '10497',
        msrp: 99.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/10497_prod.jpg',
        status: 'retiring_soon',
        legoUrl: 'https://www.lego.com/en-us/product/galaxy-explorer-10497'
      },
      {
        id: '21348',
        name: 'Dungeons & Dragons: Red Dragon\'s Tale',
        setNumber: '21348',
        msrp: 359.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/21348_prod.jpg',
        status: 'limited_stock',
        legoUrl: 'https://www.lego.com/en-us/product/dungeons-dragons-21348'
      },
      {
        id: '76419',
        name: 'Hogwarts Castle and Grounds',
        setNumber: '76419',
        msrp: 169.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/76419_prod.jpg',
        status: 'retiring_soon',
        legoUrl: 'https://www.lego.com/en-us/product/hogwarts-castle-76419'
      },
      {
        id: '42143',
        name: 'Ferrari Daytona SP3',
        setNumber: '42143',
        msrp: 399.99,
        imageUrl: 'https://www.lego.com/cdn/product-assets/product.img.pri/42143_prod.jpg',
        status: 'retiring_soon',
        legoUrl: 'https://www.lego.com/en-us/product/ferrari-daytona-sp3-42143'
      }
    ];
  }
}
