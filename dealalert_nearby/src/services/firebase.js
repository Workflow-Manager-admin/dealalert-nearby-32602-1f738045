//
// Firebase Admin initialization for authentication, Firestore, and messaging
//
const admin = require('firebase-admin');
const path = require('path');

// You can store your Firebase service account credentials in environment variable or a secrets file.
const serviceAccount = process.env.FIREBASE_CREDENTIALS_PATH
  ? require(path.resolve(process.env.FIREBASE_CREDENTIALS_PATH))
  : process.env.FIREBASE_CREDENTIALS_JSON
  ? JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON)
  : null;

if (!serviceAccount) {
  throw new Error('Missing Firebase Admin SDK credentials. Set FIREBASE_CREDENTIALS_PATH or FIREBASE_CREDENTIALS_JSON.');
}

// PUBLIC_INTERFACE
function initializeFirebase() {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DB_URL,
    });
  }
}

initializeFirebase();

module.exports = {
  admin,
};
