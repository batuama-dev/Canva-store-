// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database'); // Import the database connection

// In a real application, this secret should be stored in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long-and-random';

// Hardcoded credentials are removed, as they will be fetched from the database


exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT id, username, password_hash FROM admins WHERE username = $1', [username]);
    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
    }

    // Credentials are valid, create a JWT
    const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, JWT_SECRET, {
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
    const { id } = req.user; // Assuming req.user is populated by authMiddleware with admin's id

    // 1. Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'Veuillez remplir tous les champs.' });
    }
  
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Le nouveau mot de passe et la confirmation ne correspondent pas.' });
    }

    if (newPassword.length < 6) { // Example: Minimum password length
      return res.status(400).json({ success: false, message: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' });
    }
  
    try {
      // 2. Retrieve current password hash from database
      const result = await pool.query('SELECT password_hash FROM admins WHERE id = $1', [id]);
      const admin = result.rows[0];

      if (!admin) {
        return res.status(404).json({ success: false, message: 'Administrateur non trouvé.' });
      }

      // 3. Verify the current password
      const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Le mot de passe actuel est incorrect.' });
      }
  
      // 4. Hash the new password
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);
  
      // 5. Update the password hash in the database
      await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [newPasswordHash, id]);
  
      res.json({ success: true, message: 'Mot de passe mis à jour avec succès.' });
  
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ success: false, message: 'Erreur du serveur lors du changement de mot de passe.' });
    }
  };
  
