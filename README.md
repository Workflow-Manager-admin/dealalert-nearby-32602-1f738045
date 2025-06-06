# DealAlert Nearby – Backend (Express.js + Firebase)

This is the backend for DealAlert Nearby, providing APIs for location-based deals, user submissions, push notifications, Firebase Authentication, real-time Firestore sync, and basic monetization endpoints.

## Features
- **Location-based Deal Alerts** – Fetch deals near you using `/api/deals/nearby`
- **Deal Timer** – Each deal provides a countdown, managed server-side
- **Real-time Deal Updates** – Backed by Firestore
- **User Authentication** – Sign up/Login via Firebase (`/api/user/signup`, `/api/user/login`)
- **Push Notifications** – Send out via FCM (`/api/notifications/send`)
- **Deal Submission** – `/api/deal/submit` (requires token)
- **Ad & Affiliate Monetization** – `/api/ads/list` for sample ads

## Environment & Setup
1. **Requirements:** Node.js 16+, Firebase service account key.
2. `cd dealalert_nearby`
3. Install deps: `npm install`
4. Set ENV vars *(see below)* or place service account JSON and set `FIREBASE_CREDENTIALS_PATH`
5. Start locally: `npm run dev`

## Required Environment Variables:
- `FIREBASE_CREDENTIALS_PATH=<absolute/path/to/serviceAccount.json>`
- `FIREBASE_DB_URL=<your-firebase-database-url>`

## Running
- `npm run dev` for development (auto-reload)
- See `/docs` for API Swagger docs

## Directory structure
- `src/controllers/` — API endpoint logic
- `src/services/` — Firebase SDK integration
- `src/routes/` — Express.js routing
- `src/middleware/` — Custom middleware (auth, etc.)

## API Examples

### Get deals nearby
```
GET /api/deals/nearby?lat=<LAT>&lng=<LNG>[&radius=5]
```

### Submit a deal
```
POST /api/deal/submit
Authorization: Bearer <Firebase ID Token>
Content-Type: application/json

{
  "title": "20% Off Pizza!",
  "description": "Show this app to get the discount",
  "businessName": "Tony's Pizza",
  "lat": 12.34,
  "lng": 56.78,
  "expiresAt": 1720000000000, // ms unix timestamp in future
  "imageUrl": "",
  "dealUrl": ""
}
```