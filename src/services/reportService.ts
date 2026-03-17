/**
 * HydraNet Report & Task Service
 * Handles leakage report submission, assignment, and status updates
 */

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  LeakageReport,
  RepairSubmission,
  ReportStatus,
  ReportPriority,
  ReportType,
  ActivityLog,
} from './types';
import { findUtilityByLocation, findDMAByLocation } from './geospatialService';
import { createAuditLog } from './auditService';

import {
  notifyDMAManagerOfNewReport,
  notifyTeamLeaderOfAssignment,
  notifyEngineersOfTeamTask,
  notifyDMAManagerOfSubmission,
  notifyTeamLeaderOfApproval,
  notifyTeamLeaderOfRejection,
  notifyEngineersOfRejection,
} from './realNotificationService';

interface GeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * Submit a new leakage report (Public or Authenticated)
 */
export async function submitLeakageReport(
  description: string,
  location: GeoPoint,
  priority: ReportPriority,
  type: ReportType,
  imageUrls: string[],
  reportedByUserId?: string
): Promise<LeakageReport> {
  try {
    // Determine Utility and DMA using GPS
    const utility = await findUtilityByLocation(location);

    if (!utility) {
      // Route to Administrator for unassigned reports
      const report: LeakageReport = {
        id: '', // Will be set by Firestore
        utilityId: 'UNASSIGNED',
        dmaId: 'UNASSIGNED',
        status: 'New',
        priority,
        type,
        description,
        location,
        images: imageUrls.map((url, index) => ({
          url,
          storagePath: `reports/unassigned/${Date.now()}-${index}`,
          uploadedAt: new Date().toISOString(),
        })),
        reportedBy: reportedByUserId || 'Anonymous',
        trackingId: generateTrackingId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'reports'), report);
      report.id = docRef.id;

      // Notify Administrator
      await notifyRelevantManagers('NEW_REPORT', report, 'Administrator');

      // Audit
      await createAuditLog({
        action: 'REPORT_CREATED',
        userId: reportedByUserId || 'anonymous',
        userName: 'Anonymous User',
        userRole: 'Engineer',
        resourceType: 'Report',
        resourceId: report.id,
        details: { reason: 'Location outside all utility boundaries' },
        utilityId: 'UNASSIGNED',
      });

      return report;
    }

    const dma = await findDMAByLocation(location, utility.id);

    if (!dma) {
      // Route to Utility Manager
      const report: LeakageReport = {
        id: '',
        utilityId: utility.id,
        dmaId: 'UNASSIGNED',
        status: 'New',
        priority,
        type,
        description,
        location,
        images: imageUrls.map((url, index) => ({
          url,
          storagePath: `reports/${utility.id}/unassigned/${Date.now()}-${index}`,
          uploadedAt: new Date().toISOString(),
        })),
        reportedBy: reportedByUserId || 'Anonymous',
        trackingId: generateTrackingId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'reports'), report);
      report.id = docRef.id;

      await notifyRelevantManagers('NEW_REPORT', report, 'UtilityManager', utility.id);

      await createAuditLog({
        action: 'REPORT_CREATED',
        userId: reportedByUserId || 'anonymous',
        userName: 'Anonymous User',
        userRole: 'Engineer',
        resourceType: 'Report',
        resourceId: report.id,
        details: { reason: 'Location outside all DMA boundaries' },
        utilityId: utility.id,
      });

      return report;
    }

    // Report routed to correct DMA
    const report: LeakageReport = {
      id: '',
      utilityId: utility.id,
      dmaId: dma.id,
      branchId: undefined,
      status: 'New',
      priority,
      type,
      description,
      location,
      images: imageUrls.map((url, index) => ({
        url,
        storagePath: `reports/${utility.id}/${dma.id}/${Date.now()}-${index}`,
        uploadedAt: new Date().toISOString(),
      })),
      reportedBy: reportedByUserId || 'Anonymous',
      trackingId: generateTrackingId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'reports'), report);
    report.id = docRef.id;

    // Notify DMA Manager
    await notifyRelevantManagers('NEW_REPORT', report, 'DMAManager', utility.id, dma.id);

    // Log activity
    await addActivityLog(report.id, 'REPORT_CREATED', reportedByUserId || 'anonymous', 'Anonymous User', 'Report created');

    // Audit
    await createAuditLog({
      action: 'REPORT_CREATED',
      userId: reportedByUserId || 'anonymous',
      userName: 'Anonymous User',
      userRole: 'Engineer',
      resourceType: 'Report',
      resourceId: report.id,
      details: { utility: utility.name, dma: dma.name },
      utilityId: utility.id,
      dmaId: dma.id,
    });

    return report;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}

/**
 * Assign report to a team
 */
export async function assignReportToTeam(
  reportId: string,
  teamId: string,
  teamLeaderId: string,
  assignedByUserId: string
): Promise<void> {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, {
      status: 'Assigned',
      assignedTeamId: teamId,
      assignedTeamLeaderId: teamLeaderId,
      updatedAt: new Date().toISOString(),
    });

    // Log activity
    await addActivityLog(reportId, 'REPORT_ASSIGNED', assignedByUserId, 'DMA Manager', 'Report assigned to team');

    // Audit
    const report = await getReportById(reportId);
    await createAuditLog({
      action: 'REPORT_ASSIGNED',
      userId: assignedByUserId,
      userName: 'DMA Manager',
      userRole: 'DMAManager',
      resourceType: 'Report',
      resourceId: reportId,
      details: { teamId, teamLeaderId },
      utilityId: report!.utilityId,
      dmaId: report!.dmaId,
    });

    // Notify team
    await notifyRelevantManagers('TASK_ASSIGNED', report!, 'TeamLeader', report!.utilityId, report!.dmaId);
  } catch (error) {
    console.error('Error assigning report:', error);
    throw error;
  }
}

/**
 * Update report status
 */
export async function updateReportStatus(
  reportId: string,
  newStatus: ReportStatus,
  updatedByUserId: string,
  notes?: string
): Promise<void> {
  try {
    const updates: any = {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    if (newStatus === 'Closed') {
      updates.closedAt = new Date().toISOString();
    }

    await updateDoc(doc(db, 'reports', reportId), updates);

    // Log activity
    await addActivityLog(reportId, 'STATUS_CHANGED', updatedByUserId, 'Team', `Status changed to ${newStatus}`, notes);

    // Audit
    const report = await getReportById(reportId);
    await createAuditLog({
      action: 'REPORT_STATUS_CHANGED',
      userId: updatedByUserId,
      userName: 'Team Member',
      userRole: 'Engineer',
      resourceType: 'Report',
      resourceId: reportId,
      details: { newStatus, notes },
      utilityId: report!.utilityId,
      dmaId: report!.dmaId,
    });
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}

/**
 * Submit repair completion
 */
export async function submitRepairCompletion(
  reportId: string,
  teamLeaderId: string,
  teamId: string,
  beforeImages: string[],
  afterImages: string[],
  repairNotes: string,
  materialsUsed: string[]
): Promise<RepairSubmission> {
  try {
    // Get current report
    const report = await getReportById(reportId);
    if (!report) throw new Error('Report not found');

    const submission: RepairSubmission = {
      id: '', // Set by Firestore
      reportId,
      teamLeaderId,
      teamId,
      submittedAt: new Date().toISOString(),
      submittedBy: teamLeaderId,
      beforeImages: beforeImages.map((url, index) => ({
        url,
        storagePath: `submissions/${reportId}/before-${index}`,
      })),
      afterImages: afterImages.map((url, index) => ({
        url,
        storagePath: `submissions/${reportId}/after-${index}`,
      })),
      repairNotes,
      materialsUsed,
      status: 'Pending',
    };

    const docRef = await addDoc(collection(db, 'submissions'), submission);
    submission.id = docRef.id;

    // Update report status
    await updateReportStatus(reportId, 'RepairSubmitted', teamLeaderId, 'Repair submission documented');

    // Notify DMA Manager for approval
    await notifyRelevantManagers('SUBMISSION_APPROVED', report, 'DMAManager', report.utilityId, report.dmaId);

    // Audit
    await createAuditLog({
      action: 'SUBMISSION_CREATED',
      userId: teamLeaderId,
      userName: 'Team Leader',
      userRole: 'TeamLeader',
      resourceType: 'Submission',
      resourceId: submission.id,
      details: { reportId, materialsUsed },
      utilityId: report.utilityId,
      dmaId: report.dmaId,
    });

    return submission;
  } catch (error) {
    console.error('Error submitting repair:', error);
    throw error;
  }
}

/**
 * Approve repair submission
 */
export async function approveRepairSubmission(
  submissionId: string,
  approvalNotes: string,
  approvedByUserId: string
): Promise<void> {
  try {
    const submissionRef = doc(db, 'submissions', submissionId);
    const submission = await getDoc(submissionRef);
    const submissionData = submission.data() as RepairSubmission;

    await updateDoc(submissionRef, {
      status: 'Approved',
      approvalNotes,
      approvedBy: approvedByUserId,
      approvedAt: new Date().toISOString(),
    });

    // Close the report
    await updateReportStatus(submissionData.reportId, 'Closed', approvedByUserId, 'Repair approved and closed');

    // Notify team
    const report = await getReportById(submissionData.reportId);
    await notifyRelevantManagers('SUBMISSION_APPROVED', report!, 'TeamLeader', report!.utilityId, report!.dmaId);

    // Audit
    await createAuditLog({
      action: 'SUBMISSION_APPROVED',
      userId: approvedByUserId,
      userName: 'DMA Manager',
      userRole: 'DMAManager',
      resourceType: 'Submission',
      resourceId: submissionId,
      details: { approvalNotes },
      utilityId: report!.utilityId,
      dmaId: report!.dmaId,
    });
  } catch (error) {
    console.error('Error approving repair:', error);
    throw error;
  }
}

/**
 * Reject repair submission
 */
export async function rejectRepairSubmission(
  submissionId: string,
  rejectionNotes: string,
  rejectedByUserId: string
): Promise<void> {
  try {
    const submissionRef = doc(db, 'submissions', submissionId);
    const submission = await getDoc(submissionRef);
    const submissionData = submission.data() as RepairSubmission;

    await updateDoc(submissionRef, {
      status: 'Rejected',
      approvalNotes: rejectionNotes,
      approvedBy: rejectedByUserId,
      approvedAt: new Date().toISOString(),
    });

    // Revert report to 'InProgress'
    await updateReportStatus(submissionData.reportId, 'InProgress', rejectedByUserId, `Repair rejected: ${rejectionNotes}`);

    // Notify team
    const report = await getReportById(submissionData.reportId);
    await notifyRelevantManagers('SUBMISSION_REJECTED', report!, 'TeamLeader', report!.utilityId, report!.dmaId);

    // Audit
    await createAuditLog({
      action: 'SUBMISSION_REJECTED',
      userId: rejectedByUserId,
      userName: 'DMA Manager',
      userRole: 'DMAManager',
      resourceType: 'Submission',
      resourceId: submissionId,
      details: { rejectionNotes },
      utilityId: report!.utilityId,
      dmaId: report!.dmaId,
    });
  } catch (error) {
    console.error('Error rejecting repair:', error);
    throw error;
  }
}

/**
 * Get report by ID
 */
export async function getReportById(reportId: string): Promise<LeakageReport | null> {
  try {
    const snapshot = await getDoc(doc(db, 'reports', reportId));
    return snapshot.exists() ? (snapshot.data() as LeakageReport) : null;
  } catch (error) {
    console.error('Error getting report:', error);
    throw error;
  }
}

/**
 * Get reports for DMA
 */
export async function getReportsForDMA(dmaId: string): Promise<LeakageReport[]> {
  try {
    const q = query(collection(db, 'reports'), where('dmaId', '==', dmaId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as LeakageReport);
  } catch (error) {
    console.error('Error getting DMA reports:', error);
    throw error;
  }
}

/**
 * Get reports assigned to team
 */
export async function getReportsForTeam(teamId: string): Promise<LeakageReport[]> {
  try {
    const q = query(collection(db, 'reports'), where('assignedTeamId', '==', teamId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as LeakageReport);
  } catch (error) {
    console.error('Error getting team reports:', error);
    throw error;
  }
}

/**
 * Get unassigned reports
 */
export async function getUnassignedReports(): Promise<LeakageReport[]> {
  try {
    const q = query(collection(db, 'reports'), where('status', '==', 'New'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data() as LeakageReport);
  } catch (error) {
    console.error('Error getting unassigned reports:', error);
    throw error;
  }
}

/**
 * Add activity log entry for a report
 */
async function addActivityLog(
  reportId: string,
  action: string,
  actorId: string,
  actorName: string,
  description: string,
  notes?: string
): Promise<void> {
  try {
    const activityLog: ActivityLog = {
      id: '', // Set by Firestore
      reportId,
      action,
      actorId,
      actorName,
      actorRole: 'Engineer',
      description: notes ? `${description}: ${notes}` : description,
      timestamp: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'reports', reportId, 'activities'), activityLog);
    activityLog.id = docRef.id;
  } catch (error) {
    console.error('Error adding activity log:', error);
  }
}

/**
 * Generate unique tracking ID
 */
function generateTrackingId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HN-${timestamp}-${random}`;
}
