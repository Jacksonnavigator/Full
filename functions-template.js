/**
 * HydraNet Firebase Cloud Functions
 * Deploy these to handle server-side logic
 * 
 * Setup:
 * 1. firebase init functions
 * 2. Install admin SDK: npm install firebase-admin
 * 3. Replace functions/index.js with this file
 * 4. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

// ============ AUTHENTICATION FUNCTIONS ============

/**
 * Set custom JWT claims for user (used in security rules)
 * Called after user registration or approval
 */
exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth || !context.auth.token.admin) {
      throw new functions.https.HttpsError('permission-denied', 'Only administrators can set claims');
    }

    const { userId, role, utilityId, dmaId, teamId } = data;

    await auth.setCustomUserClaims(userId, {
      role,
      utilityId: utilityId || null,
      dmaId: dmaId || null,
      teamId: teamId || null,
    });

    return { success: true, message: 'Custom claims set successfully' };
  } catch (error) {
    console.error('Error setting custom claims:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Create a new user (called by administrators)
 */
exports.createUser = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');
    }

    const { email, password, firstName, lastName, role, utilityId, dmaId, branchId, teamId } = data;

    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
    });

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      email,
      firstName,
      lastName,
      role,
      utilityId: utilityId || null,
      dmaId: dmaId || null,
      branchId: branchId || null,
      teamId: teamId || null,
      isApproved: false,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
      createdBy: context.auth.uid,
    });

    // Set initial custom claims
    await auth.setCustomUserClaims(userRecord.uid, {
      role,
      utilityId: utilityId || null,
      dmaId: dmaId || null,
      teamId: teamId || null,
      approved: false,
    });

    return { success: true, userId: userRecord.uid };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Approve user (admin only)
 * Triggered by Firestore update
 */
exports.approveUser = functions.firestore.document('users/{userId}').onUpdate(async (change, context) => {
  try {
    const before = change.before.data();
    const after = change.after.data();

    // If isApproved changed from false to true
    if (!before.isApproved && after.isApproved) {
      const userId = context.params.userId;

      // Update custom claims
      await auth.setCustomUserClaims(userId, {
        role: after.role,
        utilityId: after.utilityId || null,
        dmaId: after.dmaId || null,
        teamId: after.teamId || null,
        approved: true,
      });

      // Create notification
      const notifRef = db.collection('notifications').doc();
      await notifRef.set({
        recipientId: userId,
        recipientRole: after.role,
        type: 'USER_APPROVED',
        title: 'Account Approved',
        message: 'Your account has been approved. You can now log in.',
        isRead: false,
        createdAt: admin.firestore.Timestamp.now(),
      });

      console.log(`User ${userId} approved successfully`);
    }
  } catch (error) {
    console.error('Error approving user:', error);
  }
});

// ============ REPORT ROUTING FUNCTIONS ============

/**
 * Auto-route unassigned reports to administrators
 * Triggered when a new report with dmaId='UNASSIGNED' is created
 */
exports.escalateUnassignedReport = functions.firestore.document('reports/{reportId}').onCreate(async (snap) => {
  try {
    const report = snap.data();

    // Only escalate if report couldn't be routed
    if (report.dmaId === 'UNASSIGNED') {
      // Get all admin users
      const adminsSnapshot = await db
        .collection('users')
        .where('role', '==', 'Administrator')
        .where('isApproved', '==', true)
        .get();

      if (adminsSnapshot.empty) {
        console.warn('No administrators found to notify');
        return;
      }

      // Create notifications for each admin
      const batch = db.batch();

      for (const adminDoc of adminsSnapshot.docs) {
        const notifRef = db.collection('notifications').doc();
        batch.set(notifRef, {
          recipientId: adminDoc.id,
          recipientRole: 'Administrator',
          type: 'ESCALATION',
          title: 'Unassigned Report',
          message: `New report outside service area: ${report.description}`,
          reportId: snap.id,
          data: {
            reportId: snap.id,
            status: report.status,
            priority: report.priority,
            location: report.location,
          },
          isRead: false,
          createdAt: admin.firestore.Timestamp.now(),
        });
      }

      await batch.commit();
      console.log(`Escalated report ${snap.id} to administrators`);
    }
  } catch (error) {
    console.error('Error escalating report:', error);
  }
});

/**
 * Auto-create audit log entry for report submission
 */
exports.logReportSubmission = functions.firestore.document('reports/{reportId}').onCreate(async (snap) => {
  try {
    const report = snap.data();

    const auditLog = {
      action: 'REPORT_CREATED',
      userId: report.reportedBy || 'anonymous',
      userName: 'Anonymous User',
      userRole: 'Engineer',
      resourceType: 'Report',
      resourceId: snap.id,
      details: {
        priority: report.priority,
        type: report.type,
        utilityId: report.utilityId,
        dmaId: report.dmaId,
      },
      timestamp: admin.firestore.Timestamp.now(),
      utilityId: report.utilityId,
      dmaId: report.dmaId || null,
    };

    await db.collection('auditLogs').add(auditLog);
  } catch (error) {
    console.error('Error logging report submission:', error);
  }
});

// ============ TASK ASSIGNMENT FUNCTIONS ============

/**
 * Create notifications when report is assigned
 */
exports.notifyTeamOnAssignment = functions.firestore
  .document('reports/{reportId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();

      // If status changed to 'Assigned'
      if (before.status !== 'Assigned' && after.status === 'Assigned') {
        const teamId = after.assignedTeamId;
        const teamLeaderId = after.assignedTeamLeaderId;

        // Get team members
        const teamSnapshot = await db.collection('teams').doc(teamId).get();
        const team = teamSnapshot.data();

        if (!team) {
          console.warn(`Team ${teamId} not found`);
          return;
        }

        // Create notifications for team members
        const batch = db.batch();
        const members = [teamLeaderId, ...(team.members || [])];

        for (const memberId of members) {
          const notifRef = db.collection('notifications').doc();
          batch.set(notifRef, {
            recipientId: memberId,
            recipientRole: memberId === teamLeaderId ? 'TeamLeader' : 'Engineer',
            type: 'TASK_ASSIGNED',
            title: 'New Task Assigned',
            message: `You have been assigned to resolve report ${after.trackingId}`,
            reportId: context.params.reportId,
            data: {
              reportId: context.params.reportId,
              teamId: teamId,
              priority: after.priority,
            },
            isRead: false,
            createdAt: admin.firestore.Timestamp.now(),
          });
        }

        await batch.commit();
      }
    } catch (error) {
      console.error('Error notifying team:', error);
    }
  });

// ============ APPROVAL WORKFLOW FUNCTIONS ============

/**
 * Close report when submission is approved
 */
exports.closeReportOnApproval = functions.firestore
  .document('submissions/{submissionId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();

      // If status changed to 'Approved'
      if (before.status !== 'Approved' && after.status === 'Approved') {
        const reportId = after.reportId;

        // Update report status to 'Closed'
        await db.collection('reports').doc(reportId).update({
          status: 'Closed',
          closedAt: admin.firestore.Timestamp.now(),
          updatedAt: admin.firestore.Timestamp.now(),
        });

        // Notify team of approval
        const reportSnapshot = await db.collection('reports').doc(reportId).get();
        const report = reportSnapshot.data();

        if (report && report.assignedTeamLeaderId) {
          const notifRef = db.collection('notifications').doc();
          await notifRef.set({
            recipientId: report.assignedTeamLeaderId,
            recipientRole: 'TeamLeader',
            type: 'SUBMISSION_APPROVED',
            title: 'Repair Approved',
            message: `Your repair submission for ${report.trackingId} has been approved and closed`,
            reportId: reportId,
            isRead: false,
            createdAt: admin.firestore.Timestamp.now(),
          });
        }

        console.log(`Report ${reportId} closed after approval`);
      }
    } catch (error) {
      console.error('Error closing report on approval:', error);
    }
  });

/**
 * Revert report to in-progress when submission is rejected
 */
exports.revertReportOnRejection = functions.firestore
  .document('submissions/{submissionId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();

      // If status changed to 'Rejected'
      if (before.status !== 'Rejected' && after.status === 'Rejected') {
        const reportId = after.reportId;

        // Revert to InProgress
        await db.collection('reports').doc(reportId).update({
          status: 'InProgress',
          updatedAt: admin.firestore.Timestamp.now(),
        });

        // Notify team of rejection
        const reportSnapshot = await db.collection('reports').doc(reportId).get();
        const report = reportSnapshot.data();

        if (report && report.assignedTeamLeaderId) {
          const notifRef = db.collection('notifications').doc();
          await notifRef.set({
            recipientId: report.assignedTeamLeaderId,
            recipientRole: 'TeamLeader',
            type: 'SUBMISSION_REJECTED',
            title: 'Repair Rejected',
            message: `Your repair submission for ${report.trackingId} was rejected. Please review and resubmit.`,
            reportId: reportId,
            data: {
              rejectionNotes: after.approvalNotes || 'No details provided',
            },
            isRead: false,
            createdAt: admin.firestore.Timestamp.now(),
          });
        }

        console.log(`Report ${reportId} reverted to InProgress after rejection`);
      }
    } catch (error) {
      console.error('Error reverting report on rejection:', error);
    }
  });

// ============ ANALYTICS FUNCTIONS ============

/**
 * Calculate and update team metrics monthly
 * Runs at midnight on the 1st of every month
 */
exports.calculateMonthlyTeamMetrics = functions.pubsub
  .schedule('0 0 1 * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const teamsSnapshot = await db.collection('teams').get();
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const period = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;

      for (const teamDoc of teamsSnapshot.docs) {
        const teamId = teamDoc.id;

        // Get all reports for this team
        const reportsSnapshot = await db
          .collection('reports')
          .where('assignedTeamId', '==', teamId)
          .get();

        const reports = reportsSnapshot.docs.map((d) => d.data());

        // Filter by period
        const startDate = new Date(previousMonth);
        const endDate = new Date(previousMonth);
        endDate.setMonth(endDate.getMonth() + 1);

        const periodReports = reports.filter((r) => {
          const reportDate = new Date(r.createdAt.toDate());
          return reportDate >= startDate && reportDate < endDate;
        });

        // Calculate metrics
        const totalAssigned = periodReports.length;
        const completed = periodReports.filter((r) => r.status === 'Closed').length;
        const rejected = periodReports.filter((r) => r.status === 'Rejected').length;

        let totalCompletionTime = 0;
        let completedCount = 0;

        for (const report of periodReports) {
          if (report.status === 'Closed' && report.closedAt) {
            const hours =
              (report.closedAt.toDate() - new Date(report.createdAt.toDate())) / (1000 * 60 * 60);
            totalCompletionTime += hours;
            completedCount++;
          }
        }

        const avgCompletionTime = completedCount > 0 ? totalCompletionTime / completedCount : 0;
        const completionRate = totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0;
        const approvalRate = completed > 0 ? ((completed - rejected) / completed) * 100 : 0;
        const performanceScore = completionRate * 0.6 + approvalRate * 0.4;

        // Save metrics
        const metricsRef = db.collection('teamMetrics').doc(`${teamId}-${period}`);
        await metricsRef.set({
          teamId,
          period,
          totalTasksAssigned: totalAssigned,
          totalTasksCompleted: completed,
          totalTasksRejected: rejected,
          averageCompletionTime: avgCompletionTime,
          performanceScore: Math.max(0, Math.min(100, performanceScore)),
          approvalRate: approvalRate,
          updatedAt: admin.firestore.Timestamp.now(),
        });
      }

      console.log('Monthly team metrics calculated successfully');
    } catch (error) {
      console.error('Error calculating team metrics:', error);
    }
  });

/**
 * Calculate and update DMA metrics monthly
 */
exports.calculateMonthlyDMAMetrics = functions.pubsub
  .schedule('0 1 1 * *') // Run 1 hour after team metrics
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const dmasSnapshot = await db.collection('dmas').get();
      const previousMonth = new Date();
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const period = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, '0')}`;

      for (const dmaDoc of dmasSnapshot.docs) {
        const dmaId = dmaDoc.id;

        const reportsSnapshot = await db.collection('reports').where('dmaId', '==', dmaId).get();

        const reports = reportsSnapshot.docs.map((d) => d.data());

        const startDate = new Date(previousMonth);
        const endDate = new Date(previousMonth);
        endDate.setMonth(endDate.getMonth() + 1);

        const periodReports = reports.filter((r) => {
          const reportDate = new Date(r.createdAt.toDate?.() || r.createdAt);
          return reportDate >= startDate && reportDate < endDate;
        });

        const totalReceived = periodReports.length;
        const resolved = periodReports.filter((r) => r.status === 'Closed').length;

        const metricsRef = db.collection('dmaMetrics').doc(`${dmaId}-${period}`);
        await metricsRef.set({
          dmaId,
          period,
          totalReportsReceived: totalReceived,
          totalReportsResolved: resolved,
          performanceScore: totalReceived > 0 ? (resolved / totalReceived) * 100 : 0,
          updatedAt: admin.firestore.Timestamp.now(),
        });
      }

      console.log('Monthly DMA metrics calculated successfully');
    } catch (error) {
      console.error('Error calculating DMA metrics:', error);
    }
  });

// ============ CLEANUP FUNCTIONS ============

/**
 * Delete unread notifications older than 90 days
 */
exports.cleanupOldNotifications = functions.pubsub
  .schedule('0 2 * * 0') // Weekly on Sunday at 2 AM
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const snapshot = await db
        .collection('notifications')
        .where('isRead', '==', true)
        .where('createdAt', '<', ninetyDaysAgo)
        .get();

      const batch = db.batch();
      let count = 0;

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
      });

      if (count > 0) {
        await batch.commit();
        console.log(`Deleted ${count} old notifications`);
      }
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
    }
  });

module.exports = { exports };
