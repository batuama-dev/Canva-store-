const db = require('../config/database');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Helper pour gérer les erreurs (version sécurisée)
const handleError = (res, error, defaultMessage = 'An internal server error occurred.') => {
  console.error('--- ERROR ---', error);
  res.status(500).json({ error: error.message || defaultMessage });
};

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

// @desc    Get all messages with pagination
// @route   GET /api/messages
// @access  Private/Admin
exports.getAllMessages = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    // Get total number of messages
    const totalResult = await db.query('SELECT COUNT(*) FROM messages');
    const totalMessages = parseInt(totalResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalMessages / limit);

    // Get messages for the current page
    const messagesQuery = 'SELECT * FROM messages ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const { rows } = await db.query(messagesQuery, [limit, offset]);

    res.json({
      messages: rows,
      totalPages,
      currentPage: page,
    });
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
    const msg = {
      to: message.sender_email,
      from: 'templyfast@gmail.com', // Must be the verified sender email in SendGrid
      subject: `Re: Your message to Templyfast`,
      text: `Bonjour à vous ${message.sender_name},\n\nPour votre message à Templyfast :\n"${message.message}"\n\nVoici notre réponse :\n\n---\n${replyText}\n---\n\nCordialement,\nL'équipe de Templyfast 😉`,
      // You can also use an `html` property for richer content
    };

    // Send the email using SendGrid
    await sgMail.send(msg);

    // Update message status to 'replied'
    const updateStatusQuery = "UPDATE messages SET status = 'replied' WHERE id = $1";
    await db.query(updateStatusQuery, [id]);
    
    res.status(200).json({ message: 'Reply sent successfully.' });

  } catch (error) {
    // Distinguer erreur BDD et erreur envoi email
    if (error.response) { // SendGrid errors have a 'response' property
        console.error('--- SENDGRID ERROR ---', error.response.body);
        handleError(res, error, 'Failed to send reply email via SendGrid.');
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
