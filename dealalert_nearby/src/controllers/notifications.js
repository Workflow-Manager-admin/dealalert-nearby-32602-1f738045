const { admin } = require('../services/firebase');

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send push notification to devices via FCM
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tokens:
 *                 type: array
 *                 items:
 *                   type: string
 *               notification:
 *                 type: object
 *                 properties:
 *                   title: { type: string }
 *                   body: { type: string }
 *                   image: { type: string }
 *     responses:
 *       200:
 *         description: Notification sent
 *       400:
 *         description: Invalid request
 */

// PUBLIC_INTERFACE
class NotificationsController {
  async send(req, res) {
    const { tokens, notification, data } = req.body;
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0 || !notification) {
      return res.status(400).json({ message: 'tokens and notification required' });
    }
    try {
      const response = await admin.messaging().sendMulticast({
        tokens,
        notification,
        data: data || {},
      });
      res.json({
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new NotificationsController();
