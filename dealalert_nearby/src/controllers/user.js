const { admin } = require('../services/firebase');

// PUBLIC_INTERFACE
class UserController {
  /**
   * User signup with email and password.
   * Expects { email, password, displayName }
   */
  async signup(req, res) {
    const { email, password, displayName } = req.body;
    if (!(email && password && displayName)) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });
      // Optionally generate a custom token; clients usually sign in with Firebase JS SDK directly.
      const customToken = await admin.auth().createCustomToken(userRecord.uid);
      res.status(201).json({ uid: userRecord.uid, customToken });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
  /**
   * Login is generally handled via Firebase client SDK; provide endpoint to validate a Firebase ID token for backend.
   */
  async login(req, res) {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Missing Firebase ID token.' });
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      res.json({ uid: decodedToken.uid, email: decodedToken.email, displayName: decodedToken.name || '' });
    } catch (e) {
      res.status(401).json({ message: 'Invalid token.' });
    }
  }
}

module.exports = new UserController();
