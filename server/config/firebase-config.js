const admin = require('firebase-admin');

// Note: In a production environment, you should use a service account JSON file.
// For this hackathon, we're initializing with the project ID.
// To fully enable ID token verification, you MUST set GOOGLE_APPLICATION_CREDENTIALS 
// environment variable pointing to your service account JSON file.

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
    });
}

module.exports = admin;
