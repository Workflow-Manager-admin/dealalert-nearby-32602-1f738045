const { admin } = require('../services/firebase');

/**
 * Helper to calculate distance (Haversine formula) between two lat/lng pairs in kilometers.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const DEAL_COLLECTION = 'deals';

class DealsController {
  // PUBLIC_INTERFACE
  /**
   * Get nearby deals based on user location.
   * Query params: lat, lng, radius (km, optional, default 5)
   */
  async getNearbyDeals(req, res) {
    const { lat, lng, radius = 5 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng are required query parameters.' });
    }
    try {
      const firestore = admin.firestore();
      // Optionally, you can add geohash/Firebase geoquery later. For now, fetch all and filter in code (not scalable for huge datasets).
      const now = Date.now();
      const allDealsSnap = await firestore.collection(DEAL_COLLECTION).where('expiresAt', '>', now).get();
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      const result = [];

      allDealsSnap.forEach(doc => {
        const data = doc.data();
        if (typeof data.lat !== 'number' || typeof data.lng !== 'number') return; // skip corrupted
        const distance = haversineDistance(userLat, userLng, data.lat, data.lng);
        if (distance <= parseFloat(radius)) {
          // Add countdown information
          const secondsLeft = Math.floor((data.expiresAt - now) / 1000);
          result.push({
            id: doc.id,
            ...data,
            secondsLeft,
            distance,
          });
        }
      });
      return res.json({ deals: result.sort((a, b) => a.distance - b.distance) });
    } catch (e) {
      return res.status(500).json({ message: e.message || 'Failed to fetch deals.' });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Submit a new deal (protected route).
   * Expects { title, description, businessName, lat, lng, expiresAt, imageUrl, dealUrl }
   * Automatically sets author and createdAt.
   */
  async submitDeal(req, res) {
    let { title, description, businessName, lat, lng, expiresAt, imageUrl, dealUrl } = req.body;
    const uid = req.user?.uid || null;
    if (!uid) return res.status(401).json({ message: 'Must authenticate to submit a deal.' });
    if (!(title && description && businessName && typeof lat === 'number' && typeof lng === 'number' && expiresAt)) {
      return res.status(400).json({ message: 'Missing required deal fields' });
    }

    try {
      const firestore = admin.firestore();
      const now = Date.now();
      const newDeal = {
        title,
        description,
        businessName,
        lat,
        lng,
        createdAt: now,
        expiresAt,
        imageUrl: imageUrl || '',
        dealUrl: dealUrl || '',
        author: uid,
        active: true,
      };
      const docRef = await firestore.collection(DEAL_COLLECTION).add(newDeal);
      // TODO: Trigger FCM for users near the deal location (out of scope for this MVP controller).
      return res.status(201).json({ id: docRef.id, ...newDeal });
    } catch (e) {
      return res.status(500).json({ message: e.message || 'Failed to submit deal.' });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get latest (all active and valid) deals
   */
  async getAllDeals(req, res) {
    try {
      const firestore = admin.firestore();
      const now = Date.now();
      const querySnap = await firestore.collection(DEAL_COLLECTION).where('expiresAt', '>', now).get();
      const deals = [];
      querySnap.forEach(doc => deals.push({ id: doc.id, ...doc.data() }));
      res.json({ deals });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new DealsController();
