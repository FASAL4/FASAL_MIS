/**
 * Crop Merge Utility
 * 
 * This utility provides the mapping logic to handle bilingual/duplicate crop names
 * in future raw data imports. It ensures that data remains consolidated.
 * 
 * Usage:
 *   const mergedName = CROP_MAPPINGS[rawName.toLowerCase()] || rawName;
 */

const CROP_MAPPINGS = {
  // Bhindi mappings
  "bhindi": "Okra",
  "भिंडी": "Okra",
  
  // Turmeric mappings
  "haldi": "Turmeric",
  "हल्दी": "Turmeric",
  
  // Potential future mappings can be added here
};

module.exports = { CROP_MAPPINGS };
