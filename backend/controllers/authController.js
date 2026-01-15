// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In a real application, this secret should be stored in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long-and-random';

// In a real application, these should be stored securely in a database.
const ADMIN_USERNAME = 'admin';
// This is the hash for 'password123'
let ADMIN_PASSWORD_HASH = '$2b$10$dks.XAieHs0WTcb1pmGlQ.KbpNmjQwUdtgZZz4dtLfXUrePZrrbSK';

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
  }

  try {
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }

    // Credentials are valid, create a JWT
    const token = jwt.sign({ username: ADMIN_USERNAME, role: 'admin' }, JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    // Send the token in a secure, httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // The cookie is not accessible via client-side JavaScript
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Helps mitigate CSRF attacks
      maxAge: 3600000, // 1 hour in milliseconds
    });
    
    res.json({ success: true, message: 'Connexion réussie.' });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Erreur du serveur lors de la connexion.' });
  }
};

exports.logout = (req, res) => {
  // Clear the cookie by setting an expired date
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.status(200).json({ success: true, message: 'Déconnexion réussie.' });
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
  
    // 1. Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs.' });
    }
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Le nouveau mot de passe et la confirmation ne correspondent pas.' });
    }
  
    try {
      // 2. Verify the current password
      const isMatch = await bcrypt.compare(currentPassword, ADMIN_PASSWORD_HASH);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Le mot de passe actuel est incorrect.' });
      }
  
      // 3. Hash the new password
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);
  
      // 4. Update the password hash
      // In a real app, you would update this in your database.
      ADMIN_PASSWORD_HASH = newPasswordHash;
  
      console.log('Password updated successfully. New hash:', ADMIN_PASSWORD_HASH);
  
      res.json({ success: true, message: 'Mot de passe mis à jour avec succès.' });
  
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ success: false, message: 'Erreur du serveur lors du changement de mot de passe.' });
    }
  };
  
