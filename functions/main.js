/**
 * HydraNet Cloud Functions
 * Deploy these to Firebase Cloud Functions
 * Run: firebase deploy --only functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

/**
 * Set Custom Claims for RBAC
 * Called via HTTP when user logs in
 *
 * Usage:
 * POST /setCustomClaims
 * Body: { userId, role, utilityId, dmaId, teamId }
 */
exports.setCustomClaims = functions.https.onRequest(async (req, res) => {
  const {userId, role, utilityId, dmaId, teamId} = req.body;

  try {
    const customClaims = {
      role,
      utilityId: utilityId || null,
      dmaId: dmaId || null,
      teamId: teamId || null,
    };

    await auth.setCustomUserClaims(userId, customClaims);

    // Also store in Firestore for easy querying
    await db.collection("users").doc(userId).set(
        {
          customClaims,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true},
    );

    res.status(200).json({
      success: true,
      message: "Custom claims set successfully",
    });
  } catch (error) {
    console.error("Error setting custom claims:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Retry Failed Notifications
 * Runs every 5 minutes to retry failed push notifications
 *
 * Cron: 'every 5 minutes'
 */
exports.retryFailedNotifications = functions.pubsub
    .schedule("every 5 minutes")
    .onRun(async (context) => {
      try {
        const MAX_RETRIES = 3;

        // Get all failed notifications that haven't exceeded retry limit
        const snapshot = await db
            .collection("notificationQueue")
            .where("status", "==", "Failed")
            .where("attempt", "<", MAX_RETRIES)
            .limit(50)
            .get();

        console.log(`Found ${snapshot.size} failed notifications to retry`);

        for (const doc of snapshot.docs) {
          const notif = doc.data();
          const tokens = await getActiveTokensForUser(notif.userId);

          if (tokens.length === 0) {
            await doc.ref.update({
              status: "Failed",
              error: "No active tokens found",
              attempt: admin.firestore.FieldValue.increment(1),
            });
            continue;
          }

          // Retry sending via Expo
          for (const token of tokens) {
            try {
              const success = await sendExpoNotification(token, notif.title, notif.body);
              if (success) {
                await doc.ref.update({
                  status: "Sent",
                  sentAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                break;
              }
            } catch (error) {
              console.error("Error sending notification:", error);
            }
          }

          // If we reach here, increment attempt
          if (!snapshot.docs[0].data().sentAt) {
            await doc.ref.update({
              attempt: admin.firestore.FieldValue.increment(1),
            });
          }
        }

        return null;
      } catch (error) {
        console.error("Error in retryFailedNotifications:", error);
        throw error;
      }
    });

/**
 * Data Retention & Cleanup
 * Runs daily to delete or archive old reports and associated data
 * Retention policy: 90 days for closed reports, 30 days for anonymous submissions
 *
 * Cron: 'every day 02:00' (2 AM UTC)
 */
exports.dataRetentionCleanup = functions.pubsub
    .schedule("every day 02:00")
    .timeZone("UTC")
    .onRun(async (context) => {
      try {
        const now = admin.firestore.Timestamp.now();
        const ninetyDaysAgo = new admin.firestore.Timestamp(
            now.seconds - 90 * 24 * 60 * 60,
            0,
        );
        const thirtyDaysAgo = new admin.firestore.Timestamp(
            now.seconds - 30 * 24 * 60 * 60,
            0,
        );

        // 1. Archive closed reports older than 90 days
        const closedReportsSnapshot = await db
            .collection("reports")
            .where("status", "==", "Closed")
            .where("closedAt", "<=", ninetyDaysAgo)
            .limit(100)
            .get();

        console.log(`Archiving ${closedReportsSnapshot.size} old closed reports`);

        for (const doc of closedReportsSnapshot.docs) {
          const report = doc.data();

          // Move to archive collection
          await db.collection("archivedReports").doc(doc.id).set(report);

          // Delete images from storage
          if (report.images && Array.isArray(report.images)) {
            const bucket = admin.storage().bucket();
            for (const image of report.images) {
              try {
                await bucket.file(image.storagePath).delete();
              } catch (e) {
                console.warn("Could not delete image:", image.storagePath);
              }
            }
          }

          // Delete report document
          await doc.ref.delete();
        }

        // 2. Delete anonymous submission data older than 30 days
        const anonSubmissionsSnapshot = await db
            .collection("submissions")
            .where("reportedBy", "==", "Anonymous")
            .where("submittedAt", "<=", thirtyDaysAgo)
            .limit(100)
            .get();

        console.log(`Deleting ${anonSubmissionsSnapshot.size} old anonymous submissions`);

        for (const doc of anonSubmissionsSnapshot.docs) {
          const submission = doc.data();

          // Delete images
          const bucket = admin.storage().bucket();
          if (submission.beforeImages) {
            for (const image of submission.beforeImages) {
              try {
                await bucket.file(image.storagePath).delete();
              } catch (e) {
                console.warn("Could not delete image:", image.storagePath);
              }
            }
          }
          if (submission.afterImages) {
            for (const image of submission.afterImages) {
              try {
                await bucket.file(image.storagePath).delete();
              } catch (e) {
                console.warn("Could not delete image:", image.storagePath);
              }
            }
          }

          // Delete submission
          await doc.ref.delete();
        }

        // 3. Clean up old notification logs (older than 60 days)
        const sixtyDaysAgo = new admin.firestore.Timestamp(
            now.seconds - 60 * 24 * 60 * 60,
            0,
        );

        const oldNotificationsSnapshot = await db
            .collection("notificationLogs")
            .where("timestamp", "<=", sixtyDaysAgo)
            .limit(500)
            .get();

        console.log(
            `Deleting ${oldNotificationsSnapshot.size} old notification logs`,
        );

        const batch = db.batch();
        for (const doc of oldNotificationsSnapshot.docs) {
          batch.delete(doc.ref);
        }
        await batch.commit();

        console.log("Data retention cleanup completed successfully");
        return null;
      } catch (error) {
        console.error("Error in dataRetentionCleanup:", error);
        throw error;
      }
    });

/**
 * Log Report Submission (Trigger)
 * Automatically creates audit log when a new report is created
 */
exports.logReportSubmission = functions.firestore
    .document("reports/{reportId}")
    .onCreate(async (snap) => {
      try {
        const report = snap.data();

        const auditLog = {
          action: "REPORT_CREATED",
          userId: report.reportedBy || "anonymous",
          userName: report.reportedBy === "Anonymous" ? "Anonymous User" : "Field User",
          userRole: "Engineer",
          resourceType: "Report",
          resourceId: snap.id,
          details: {
            priority: report.priority,
            description: report.description,
            utility: report.utilityId,
            dma: report.dmaId,
          },
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          utilityId: report.utilityId,
          dmaId: report.dmaId,
        };

        await db.collection("auditLogs").add(auditLog);
        console.log("Audit log created for report:", snap.id);
      } catch (error) {
        console.error("Error logging report submission:", error);
      // Don't throw - report was created successfully
      }
    });

/**
 * Log Submission Status Change (Trigger)
 * Creates audit log when submission status changes
 */
exports.logSubmissionStatusChange = functions.firestore
    .document("submissions/{submissionId}")
    .onUpdate(async (change) => {
      try {
        const before = change.before.data();
        const after = change.after.data();

        if (before.status !== after.status) {
          const auditLog = {
            action: "SUBMISSION_STATUS_CHANGED",
            userId: after.approvedBy || "system",
            userName: "DMA Manager",
            userRole: "DMAManager",
            resourceType: "Submission",
            resourceId: change.after.id,
            details: {
              oldStatus: before.status,
              newStatus: after.status,
              reportId: after.reportId,
            },
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          };

          // Get report to get utility/dma
          const report = await db.collection("reports").doc(after.reportId).get();
          if (report.exists) {
            auditLog.utilityId = report.data().utilityId;
            auditLog.dmaId = report.data().dmaId;
          }

          await db.collection("auditLogs").add(auditLog);
          console.log("Audit log created for submission status change:", change.after.id);
        }
      } catch (error) {
        console.error("Error logging submission status change:", error);
      }
    });

/**
 * HELPER: Get active tokens for user
 */
async function getActiveTokensForUser(userId) {
  try {
    const snapshot = await db
        .collection("deviceTokens")
        .where("userId", "==", userId)
        .where("isActive", "==", true)
        .get();

    return snapshot.docs.map((doc) => doc.data().deviceToken);
  } catch (error) {
    console.error("Error getting tokens:", error);
    return [];
  }
}

/**
 * HELPER: Send notification via Expo Push API
 */
async function sendExpoNotification(token, title, body) {
  try {
    const payload = {
      to: token,
      sound: "default",
      title,
      body,
      _displayInForeground: true,
      badge: 1,
      ttl: 86400,
    };

    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return result.data && result.data.id; // True if Expo accepted it
  } catch (error) {
    console.error("Error sending Expo notification:", error);
    return false;
  }
}
