const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getAllMessages,
  replyToMessage,
  updateMessageStatus
} = require('../controllers/messageController');

// For now, we assume an admin check middleware would be applied
// to the admin-specific routes in the main server file (e.g., /api/messages*)
// For simplicity here, we don't add the middleware directly.

// @route   POST /api/messages
// @desc    Submit a new contact message
// @access  Public
router.post('/', submitMessage);

// @route   GET /api/messages
// @desc    Get all contact messages
// @access  Private/Admin
router.get('/', getAllMessages);

// @route   POST /api/messages/:id/reply
// @desc    Reply to a specific message
// @access  Private/Admin
router.post('/:id/reply', replyToMessage);

// @route   PUT /api/messages/:id/status
// @desc    Update the status of a message
// @access  Private/Admin
router.put('/:id/status', updateMessageStatus);

module.exports = router;
