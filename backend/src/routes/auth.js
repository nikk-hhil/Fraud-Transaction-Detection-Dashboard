const express = require('express');
const router = express.Router();

// Placeholder auth routes (you can implement full authentication later)
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - to be implemented' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - to be implemented' });
});

router.get('/me', (req, res) => {
  res.json({ message: 'Get current user - to be implemented' });
});

module.exports = router;