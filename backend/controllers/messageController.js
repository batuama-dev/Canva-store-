const db = require('../config/database');
const nodemailer = require('nodemailer');

// Helper pour gérer les erreurs
const handleError = (res, error, defaultMessage = 'An internal server error occurred.') => {
  console.error('--- DETAILED ERROR ---', JSON.stringify(error, null, 2));
  res.status(500).json({ error: error.message || defaultMessage });
};

// Configure Nodemailer with explicit settings for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Store in .env file
    pass: process.env.EMAIL_PASS,   // Store in .env file
  },
});

// @desc    Submit a new message
// @route   POST /api/messages
// @access  Public
exports.submitMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please provide name, email, and message.' });
  }

  const query = 'INSERT INTO messages (sender_name, sender_email, message) VALUES ($1, $2, $3) RETURNING id';
  try {
    const { rows } = await db.query(query, [name, email, message]);
    res.status(201).json({ message: 'Message sent successfully!', messageId: rows[0].id });
  } catch (error) {
    handleError(res, error, 'Error saving message to database.');
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
exports.getAllMessages = async (req, res) => {
  const query = 'SELECT * FROM messages ORDER BY created_at DESC';
  try {
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    handleError(res, error, 'Error fetching messages from database.');
  }
};

// @desc    Reply to a message
// @route   POST /api/messages/:id/reply
// @access  Private/Admin
exports.replyToMessage = async (req, res) => {
  const { id } = req.params;
  const { replyText } = req.body;

  if (!replyText) {
    return res.status(400).json({ message: 'Reply text is required.' });
  }

  try {
    const findMessageQuery = 'SELECT * FROM messages WHERE id = $1';
    const { rows, rowCount } = await db.query(findMessageQuery, [id]);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    const message = rows[0];
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: message.sender_email,
      subject: `Re: Your message to Wisecom-Store`,
      text: `Hello ${message.sender_name},\n\nThank you for your message. Here is our reply:\n\n---\n${replyText}\n---\n\nOriginal message:\n"${message.message}"\n\nBest regards,\nThe Wisecom-Store Team`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Update message status to 'replied'
    const updateStatusQuery = "UPDATE messages SET status = 'replied' WHERE id = $1";
    await db.query(updateStatusQuery, [id]);
    
    res.status(200).json({ message: 'Reply sent successfully.' });

  } catch (error) {
    // Log the full error object for detailed debugging
    console.error('--- FULL NODEMAILER ERROR ---', JSON.stringify(error, null, 2));

    // Distinguer erreur BDD et erreur envoi email
    if (error.code) { // Nodemailer errors often have a 'code' property (e.g., 'ECONNECTION')
        handleError(res, error, 'Failed to send reply email.');
    } else { // Autre erreur (probablement BDD)
        handleError(res, error, 'An error occurred while processing the reply.');
    }
  }
};

// @desc    Update message status (e.g., to 'read')
// @route   PUT /api/messages/:id/status
// @access  Private/Admin
exports.updateMessageStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['new', 'read', 'replied'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const query = 'UPDATE messages SET status = $1 WHERE id = $2';
    try {
        const result = await db.query(query, [status, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Message not found.' });
        }
        res.status(200).json({ message: 'Message status updated successfully.' });
    } catch (error) {
        handleError(res, error, 'Failed to update message status.');
    }
};
