// backend/controllers/authController.js

// For demonstration purposes, we use hardcoded credentials.
// In a real application, these should be stored securely (e.g., hashed in a database).
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // In a real app, you would generate and return a JWT (JSON Web Token) here.
    // For this simple case, we'll just confirm success.
    res.json({ success: true, message: 'Connexion réussie.' });
  } else {
    res.status(401).json({ success: false, message: 'Identifiants incorrects.' });
  }
};
