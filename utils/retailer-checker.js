/**
 * Retailer Price Checker
 * Orchestrates price checks across multiple retailers
 */

import { AmazonChecker } from './retailers/amazon.js';
import { WalmartChecker } from './retailers/walmart.js';
import { TargetChecker } from './retailers/target.js';

export class RetailerChecker {
  /**
   * Check prices across all enabled retailers
   * @param {Object} legoSet - The Lego set to check
   * @param {Object} enabledRetailers - Which retailers to check
   * @returns {Promise<Object>} Price data by retailer
   */
  static async checkPrices(legoSet, enabledRetailers = {}) {
    const results = {};

    const checks = [];

    if (enabledRetailers.amazon !== false) {
      checks.push(
        AmazonChecker.checkPrice(legoSet).then(data => {
          results.amazon = data;
        })
      );
    }

    if (enabledRetailers.walmart !== false) {
      checks.push(
        WalmartChecker.checkPrice(legoSet).then(data => {
          results.walmart = data;
        })
      );
    }

    if (enabledRetailers.target !== false) {
      checks.push(
        TargetChecker.checkPrice(legoSet).then(data => {
          results.target = data;
        })
      );
    }

    // Wait for all checks to complete
    await Promise.allSettled(checks);

    return results;
  }

  /**
   * Get mock retailer data for testing
   */
  static getMockPrices(legoSet) {
    // Simulate some being available at discount
    const msrp = legoSet.msrp;
    const hasAmazonDeal = Math.random() > 0.7;
    const hasWalmartDeal = Math.random() > 0.6;
    const hasTargetDeal = Math.random() > 0.8;

    return {
      amazon: hasAmazonDeal
        ? {
            available: true,
            price: msrp * (0.7 + Math.random() * 0.2), // 70-90% of MSRP
            url: `https://www.amazon.com/s?k=lego+${legoSet.setNumber}`,
            inStock: true
          }
        : { available: false, reason: 'Not in stock' },

      walmart: hasWalmartDeal
        ? {
            available: true,
            price: msrp * (0.65 + Math.random() * 0.25), // 65-90% of MSRP
            url: `https://www.walmart.com/search?q=lego+${legoSet.setNumber}`,
            inStock: true
          }
        : { available: false, reason: 'Not found' },

      target: hasTargetDeal
        ? {
            available: true,
            price: msrp * (0.75 + Math.random() * 0.15), // 75-90% of MSRP
            url: `https://www.target.com/s?searchTerm=lego+${legoSet.setNumber}`,
            inStock: true
          }
        : { available: false, reason: 'Out of stock' }
    };
  }
}
