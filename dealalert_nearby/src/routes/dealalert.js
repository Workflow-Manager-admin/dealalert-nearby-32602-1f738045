const express = require('express');
const dealsController = require('../controllers/deals');
const userController = require('../controllers/user');
const notificationsController = require('../controllers/notifications');
const adsController = require('../controllers/ads');
const { authenticateFirebaseToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/deals/nearby:
 *   get:
 *     summary: Get deals near user location
 */
router.get('/deals/nearby', dealsController.getNearbyDeals.bind(dealsController));

/**
 * @swagger
 * /api/deal/submit:
 *   post:
 *     summary: Submit a new deal (authentication required)
 */
router.post('/deal/submit', authenticateFirebaseToken, dealsController.submitDeal.bind(dealsController));

/**
 * @swagger
 * /api/deals:
 *   get:
 *     summary: Get all current deals
 */
router.get('/deals', dealsController.getAllDeals.bind(dealsController));

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: User signup (via Firebase Auth)
 */
router.post('/user/signup', userController.signup.bind(userController));

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Validate Firebase login token
 */
router.post('/user/login', userController.login.bind(userController));

/**
 * @swagger
 * /api/notifications/send:
 *   post:
 *     summary: Send push notification via FCM
 */
router.post('/notifications/send', notificationsController.send.bind(notificationsController));

/**
 * @swagger
 * /api/ads/list:
 *   get:
 *     summary: List available ads/affiliate offers
 */
router.get('/ads/list', adsController.list.bind(adsController));

module.exports = router;
