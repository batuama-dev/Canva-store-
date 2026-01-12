// backend/utils/logger.js
const db = require('../config/database');

/**
 * Logs an activity to the database.
 * @param {string} actionType - The type of action (e.g., 'CREATE', 'UPDATE', 'DELETE').
 * @param {string} entityType - The type of entity being acted upon (e.g., 'product').
 * @param {number} entityId - The ID of the entity.
 * @param {object|string} details - Details about the activity. Can be an object or a simple string.
 */
const logActivity = async (actionType, entityType, entityId, details) => {
  const query = `
    INSERT INTO activity_logs (action_type, entity_type, entity_id, details)
    VALUES ($1, $2, $3, $4)
  `;
  
  // Convert details object to a string if it's an object
  const detailsString = typeof details === 'object' ? JSON.stringify(details) : details;

  try {
    await db.query(query, [actionType, entityType, entityId, detailsString]);
    console.log(`Activity logged: ${actionType} on ${entityType} ${entityId}`);
  } catch (error) {
    // We log the error to the console but don't re-throw,
    // as logging failure should not break the main operation.
    console.error('--- FAILED TO LOG ACTIVITY ---', error);
  }
};

module.exports = { logActivity };
