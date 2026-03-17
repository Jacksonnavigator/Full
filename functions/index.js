const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const auth = admin.auth();

// Set custom claims for user via HTTPS call
exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  try {
    await auth.setCustomUserClaims(data.userId, {
      role: data.role,
      utilityId: data.utilityId,
      dmaId: data.dmaId,
      teamId: data.teamId,
    });
    return {success: true};
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
