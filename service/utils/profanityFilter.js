/**
 * Profanity filter utility
 * 
 * This module provides functions to filter out or detect profanity in user-generated content
 * like comments, article content, or user messages.
 */

// A simple list of words to filter - in production, you might want a more extensive list
// or consider using an established profanity filter package like "bad-words"
const profanityList = [
  'badword1',
  'badword2',
  // Add more words as needed or replace with a proper dictionary
];

/**
 * Check if text contains profanity
 * @param {string} text - The text to check
 * @returns {boolean} - True if profanity is found, false otherwise
 */
function containsProfanity(text) {
  if (!text || typeof text !== 'string') return false;
  
  const lowerText = text.toLowerCase();
  return profanityList.some(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(lowerText)
  );
}

/**
 * Replace profanity in text with asterisks (local implementation)
 * @param {string} text - The text to filter
 * @returns {string} - Filtered text with profanity replaced by asterisks
 */
function filterProfanityLocal(text) {
  if (!text || typeof text !== 'string') return text;
  
  let filteredText = text;
  profanityList.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filteredText = filteredText.replace(regex, '*'.repeat(word.length));
  });
  
  return filteredText;
}

/**
 * Filter profanity using PurgoMalum external API
 * @param {string} text - The text to filter
 * @returns {string} - Filtered text with profanity removed/replaced
 */
async function filterProfanityAPI(text) {
  try {
    const encodedText = encodeURIComponent(text);
    const response = await fetch(
      `https://www.purgomalum.com/service/json?text=${encodedText}`
    );
    
    if (!response.ok) {
      console.error("PurgoMalum API error:", response.status);
      return filterProfanityLocal(text); // Fallback to local filtering if API fails
    }
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error filtering profanity with API:", error);
    return filterProfanityLocal(text); // Fallback to local filtering
  }
}

/**
 * Main filter function that uses API by default but falls back to local filtering
 * @param {string} text - The text to filter
 * @param {boolean} useAPI - Whether to use the API (true) or local filtering (false)
 * @returns {string} - Filtered text
 */
async function filterProfanity(text, useAPI = true) {
  if (useAPI) {
    return await filterProfanityAPI(text);
  } else {
    return filterProfanityLocal(text);
  }
}

module.exports = {
  containsProfanity,
  filterProfanity,
  filterProfanityLocal,
  filterProfanityAPI
};