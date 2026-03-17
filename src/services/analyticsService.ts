/**
 * HydraNet Performance & Analytics Service
 * Calculates KPIs and performance metrics for teams and DMAs
 */

import { collection, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { LeakageReport, RepairSubmission, TeamPerformanceMetrics, DMAPerformanceMetrics } from './types';

/**
 * Calculate team performance metrics for a period
 */
export async function calculateTeamMetrics(
  teamId: string,
  period: string // YYYY-MM
): Promise<TeamPerformanceMetrics> {
  try {
    // Get month range
    const [year, month] = period.split('-');
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Get all reports assigned to team
    const reportsQ = query(collection(db, 'reports'), where('assignedTeamId', '==', teamId));
    const reportsSnapshot = await getDocs(reportsQ);
    const reports = reportsSnapshot.docs.map((doc) => doc.data() as LeakageReport);

    // Filter by period
    const periodReports = reports.filter((r) => {
      const reportDate = new Date(r.createdAt);
      return reportDate >= startDate && reportDate < endDate;
    });

    // Calculate metrics
    const totalAssigned = periodReports.length;
    const completed = periodReports.filter((r) => r.status === 'Closed').length;
    const rejected = periodReports.filter((r) => r.status === 'Rejected').length;

    // Calculate average completion time
    let totalCompletionTime = 0;
    let completedCount = 0;

    for (const report of periodReports) {
      if (report.status === 'Closed' && report.closedAt) {
        const startTime = new Date(report.createdAt);
        const endTime = new Date(report.closedAt);
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        totalCompletionTime += hours;
        completedCount++;
      }
    }

    const avgCompletionTime = completedCount > 0 ? totalCompletionTime / completedCount : 0;

    // Calculate performance score (0-100)
    const completionRate = totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0;
    const approvalRate = completed > 0 ? ((completed - rejected) / completed) * 100 : 0;
    const performanceScore = (completionRate * 0.6 + approvalRate * 0.4) * (1 - Math.min(avgCompletionTime / 48, 1) * 0.2);

    const metrics: TeamPerformanceMetrics = {
      id: `${teamId}-${period}`,
      teamId,
      branchId: '', // Will be populated from team data
      dmaId: '',
      utilityId: '',
      period,
      totalTasksAssigned: totalAssigned,
      totalTasksCompleted: completed,
      totalTasksRejected: rejected,
      averageCompletionTime: avgCompletionTime,
      performanceScore: Math.max(0, Math.min(100, performanceScore)),
      responseTimeAverage: calculateResponseTime(periodReports),
      approvalRate: completedCount > 0 ? ((completedCount - rejected) / completedCount) * 100 : 0,
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore
    await setDoc(doc(db, 'teamMetrics', metrics.id), metrics);

    return metrics;
  } catch (error) {
    console.error('Error calculating team metrics:', error);
    throw error;
  }
}

/**
 * Calculate DMA performance metrics for a period
 */
export async function calculateDMAMetrics(
  dmaId: string,
  period: string // YYYY-MM
): Promise<DMAPerformanceMetrics> {
  try {
    const [year, month] = period.split('-');
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Get all reports for DMA
    const reportsQ = query(collection(db, 'reports'), where('dmaId', '==', dmaId));
    const reportsSnapshot = await getDocs(reportsQ);
    const reports = reportsSnapshot.docs.map((doc) => doc.data() as LeakageReport);

    // Filter by period
    const periodReports = reports.filter((r) => {
      const reportDate = new Date(r.createdAt);
      return reportDate >= startDate && reportDate < endDate;
    });

    const totalReceived = periodReports.length;
    const resolved = periodReports.filter((r) => r.status === 'Closed').length;

    // Calculate average resolution time
    let totalResolutionTime = 0;
    let resolvedCount = 0;

    for (const report of periodReports) {
      if (report.status === 'Closed' && report.closedAt) {
        const startTime = new Date(report.createdAt);
        const endTime = new Date(report.closedAt);
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
        totalResolutionTime += hours;
        resolvedCount++;
      }
    }

    const avgResolutionTime = resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0;
    const resolutionRate = totalReceived > 0 ? (resolved / totalReceived) * 100 : 0;

    // Performance score based on resolution rate and speed
    const performanceScore = resolutionRate * (1 - Math.min(avgResolutionTime / 72, 1) * 0.3);

    const metrics: DMAPerformanceMetrics = {
      id: `${dmaId}-${period}`,
      dmaId,
      utilityId: '', // Will be populated
      period,
      totalReportsReceived: totalReceived,
      totalReportsResolved: resolved,
      averageResolutionTime: avgResolutionTime,
      totalTeams: 0, // Will be populated from teams count
      totalEngineers: 0, // Will be populated from users count
      performanceScore: Math.max(0, Math.min(100, performanceScore)),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore
    await setDoc(doc(db, 'dmaMetrics', metrics.id), metrics);

    return metrics;
  } catch (error) {
    console.error('Error calculating DMA metrics:', error);
    throw error;
  }
}

/**
 * Calculate response time average (time from report creation to assignment)
 */
function calculateResponseTime(reports: LeakageReport[]): number {
  const assignedReports = reports.filter((r) => r.status !== 'New' && r.updatedAt);

  if (assignedReports.length === 0) return 0;

  let totalResponseMinutes = 0;

  for (const report of assignedReports) {
    const createdTime = new Date(report.createdAt);
    const updatedTime = new Date(report.updatedAt);
    const minutes = (updatedTime.getTime() - createdTime.getTime()) / (1000 * 60);
    totalResponseMinutes += minutes;
  }

  return totalResponseMinutes / assignedReports.length;
}

/**
 * Get team performance dashboard data
 */
export async function getTeamPerformanceDashboard(teamId: string): Promise<any> {
  try {
    // Get last 3 months of data
    const now = new Date();
    const months = [];

    for (let i = 2; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      months.push(`${year}-${month}`);
    }

    // Fetch metrics for each month
    const metrics = await Promise.all(months.map((month) => calculateTeamMetrics(teamId, month)));

    return {
      teamId,
      periods: months,
      metrics,
      trend: calculateTrend(metrics.map((m) => m.performanceScore)),
    };
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    throw error;
  }
}

/**
 * Get DMA performance dashboard data
 */
export async function getDMAPerformanceDashboard(dmaId: string): Promise<any> {
  try {
    const now = new Date();
    const months = [];

    for (let i = 2; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      months.push(`${year}-${month}`);
    }

    const metrics = await Promise.all(months.map((month) => calculateDMAMetrics(dmaId, month)));

    return {
      dmaId,
      periods: months,
      metrics,
      trend: calculateTrend(metrics.map((m) => m.performanceScore)),
    };
  } catch (error) {
    console.error('Error getting DMA dashboard:', error);
    throw error;
  }
}

/**
 * Calculate trend (positive, negative, or stable)
 */
function calculateTrend(scores: number[]): 'improving' | 'declining' | 'stable' {
  if (scores.length < 2) return 'stable';

  const diff = scores[scores.length - 1] - scores[0];
  const threshold = 5; // 5 point change threshold

  if (diff > threshold) return 'improving';
  if (diff < -threshold) return 'declining';
  return 'stable';
}

/**
 * Get utility-wide analytics
 */
export async function getUtilityAnalytics(utilityId: string): Promise<any> {
  try {
    // Get all reports for utility
    const reportsQ = query(collection(db, 'reports'), where('utilityId', '==', utilityId));
    const reportsSnapshot = await getDocs(reportsQ);
    const reports = reportsSnapshot.docs.map((doc) => doc.data() as LeakageReport);

    const totalReports = reports.length;
    const resolved = reports.filter((r) => r.status === 'Closed').length;
    const byPriority = {
      Critical: reports.filter((r) => r.priority === 'Critical').length,
      High: reports.filter((r) => r.priority === 'High').length,
      Medium: reports.filter((r) => r.priority === 'Medium').length,
      Low: reports.filter((r) => r.priority === 'Low').length,
    };

    const byType = {
      BurstPipeline: reports.filter((r) => r.type === 'BurstPipeline').length,
      DistributionFailure: reports.filter((r) => r.type === 'DistributionFailure').length,
      SurfaceDamage: reports.filter((r) => r.type === 'SurfaceDamage').length,
      Other: reports.filter((r) => r.type === 'Other').length,
    };

    return {
      utilityId,
      totalReports,
      resolved,
      resolutionRate: totalReports > 0 ? (resolved / totalReports) * 100 : 0,
      byPriority,
      byType,
      pending: reports.filter((r) => r.status === 'New' || r.status === 'Assigned').length,
    };
  } catch (error) {
    console.error('Error getting utility analytics:', error);
    throw error;
  }
}
