const db = require('../config/database');
const nodemailer = require('nodemailer');

// Configure Nodemailer (replace with your actual email service credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email provider
  auth: {
    user: process.env.EMAIL_USER, // Store in .env file
    pass: process.env.EMAIL_PASS,   // Store in .env file
  },
});

// @desc    Submit a new message
// @route   POST /api/messages
// @access  Public
exports.submitMessage = (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide name, email, and message.' });
  }

  const query = 'INSERT INTO messages (sender_name, sender_email, message) VALUES (?, ?, ?)';
  db.query(query, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error inserting message:', err);
      return res.status(500).json({ message: 'Error saving message to database.' });
    }
    res.status(201).json({ message: 'Message sent successfully!', messageId: result.insertId });
  });
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
exports.getAllMessages = (req, res) => {
  const query = 'SELECT * FROM messages ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ message: 'Error fetching messages from database.' });
    }
    res.json(results);
  });
};

// @desc    Reply to a message
// @route   POST /api/messages/:id/reply
// @access  Private/Admin
exports.replyToMessage = (req, res) => {
  const { id } = req.params;
  const { replyText } = req.body;

  if (!replyText) {
    return res.status(400).json({ message: 'Reply text is required.' });
  }

  const findMessageQuery = 'SELECT * FROM messages WHERE id = ?';
  db.query(findMessageQuery, [id], (err, messages) => {
    if (err || messages.length === 0) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    const message = messages[0];
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: message.sender_email,
      subject: `Re: Your message to Wisecom-Store`,
      text: `Hello ${message.sender_name},

Thank you for your message. Here is our reply:

---
${replyText}
---

Original message:
"${message.message}"

Best regards,
The Wisecom-Store Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Failed to send reply email.' });
      }

      // Update message status to 'replied'
      const updateStatusQuery = 'UPDATE messages SET status = "replied" WHERE id = ?';
      db.query(updateStatusQuery, [id], (err) => {
        if (err) {
          console.error('Error updating message status:', err);
          // Non-critical error, so we still return success for the email
        }
        res.status(200).json({ message: 'Reply sent successfully.' });
      });
    });
  });
};

// @desc    Update message status (e.g., to 'read')
// @route   PUT /api/messages/:id/status
// @access  Private/Admin
exports.updateMessageStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['new', 'read', 'replied'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const query = 'UPDATE messages SET status = ? WHERE id = ?';
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error('Error updating message status:', err);
            return res.status(500).json({ message: 'Failed to update message status.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Message not found.' });
        }
        res.status(200).json({ message: 'Message status updated successfully.' });
    });
};
