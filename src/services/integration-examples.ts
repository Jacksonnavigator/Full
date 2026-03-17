/**
 * HydraNet Firebase Integration Examples
 * Shows how to use all the Firebase services in your React Native app
 */

import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import {
  submitLeakageReport,
  assignReportToTeam,
  updateReportStatus,
  submitRepairCompletion,
  approveRepairSubmission,
  getReportById,
  getReportsForDMA,
  getReportsForTeam,
  uploadReportImage,
  uploadSubmissionImage,
  loginUser,
  logoutUser,
  getCurrentUser,
  registerUser,
  approveUser,
  getTeamPerformanceDashboard,
  getDMAPerformanceDashboard,
  getUtilityAnalytics,
} from './services';

// ============ PUBLIC REPORT SUBMISSION ============

export async function submitPublicLeakageReport() {
  try {
    console.log('Requesting location access...');
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    console.log('Selecting images...');
    const imageResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultiple: true,
      selectionLimit: 4,
      quality: 0.8,
    });

    if (imageResult.canceled) {
      return;
    }

    console.log('Uploading images...');
    const imageUrls = [];

    for (const asset of imageResult.assets) {
      try {
        const url = await uploadReportImage(
          'temp-report', // Will be updated after report is created
          asset.uri,
          (progress) => {
            console.log(`Upload progress: ${Math.round(progress.progress)}%`);
          }
        );
        imageUrls.push(url);
      } catch (error) {
        console.warn(`Failed to upload image: ${error}`);
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('No images uploaded successfully');
    }

    console.log('Submitting report...');
    const report = await submitLeakageReport(
      'Water leaking at junction near market',
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      'High', // priority: Low | Medium | High | Critical
      'BurstPipeline', // type: BurstPipeline | DistributionFailure | SurfaceDamage | Other
      imageUrls
    );

    console.log('Report submitted successfully!');
    console.log(`Tracking ID: ${report.trackingId}`);
    console.log(`Status: ${report.status}`);

    return report;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
}

// ============ MANAGER - ASSIGN REPORT TO TEAM ============

export async function dmaManagerAssignReport(
  reportId: string,
  teamId: string,
  teamLeaderId: string
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'DMAManager') {
      throw new Error('Only DMA Managers can assign reports');
    }

    console.log('Assigning report to team...');
    await assignReportToTeam(reportId, teamId, teamLeaderId, user.id);

    console.log('Report assigned successfully');
    console.log(`Team ID: ${teamId}`);
    console.log(`Team Lead ID: ${teamLeaderId}`);
  } catch (error) {
    console.error('Error assigning report:', error);
    throw error;
  }
}

// ============ TEAM LEADER - SUBMIT REPAIR ============

export async function teamLeaderSubmitRepair(reportId: string, teamId: string, teamLeaderId: string) {
  try {
    console.log('Selecting before photos...');
    const beforeResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultiple: true,
      selectionLimit: 2,
      quality: 0.8,
    });

    if (beforeResult.canceled) {
      return;
    }

    console.log('Selecting after photos...');
    const afterResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultiple: true,
      selectionLimit: 2,
      quality: 0.8,
    });

    if (afterResult.canceled) {
      return;
    }

    console.log('Uploading photos...');
    const beforeUrls = [];
    const afterUrls = [];

    for (const asset of beforeResult.assets) {
      const url = await uploadSubmissionImage(reportId, asset.uri, 'before', (progress) => {
        console.log(`Before upload: ${Math.round(progress.progress)}%`);
      });
      beforeUrls.push(url);
    }

    for (const asset of afterResult.assets) {
      const url = await uploadSubmissionImage(reportId, asset.uri, 'after', (progress) => {
        console.log(`After upload: ${Math.round(progress.progress)}%`);
      });
      afterUrls.push(url);
    }

    console.log('Submitting repair completion...');
    const submission = await submitRepairCompletion(
      reportId,
      teamLeaderId,
      teamId,
      beforeUrls,
      afterUrls,
      'Burst pipeline repaired and tested. Pressure restored to normal.',
      ['PVC Pipe 2"', 'Coupling', 'Wrapping Tape', 'Sealant']
    );

    console.log('Repair submitted for approval');
    console.log(`Submission ID: ${submission.id}`);
    console.log(`Status: ${submission.status}`);

    return submission;
  } catch (error) {
    console.error('Error submitting repair:', error);
    throw error;
  }
}

// ============ MANAGER - APPROVE REPAIR ============

export async function dmaManagerApproveRepair(submissionId: string) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'DMAManager') {
      throw new Error('Only DMA Managers can approve repairs');
    }

    console.log('Approving repair submission...');
    await approveRepairSubmission(
      submissionId,
      'Repair work completed satisfactorily. All photos verified.',
      user.id
    );

    console.log('Repair approved and report closed');
  } catch (error) {
    console.error('Error approving repair:', error);
    throw error;
  }
}

// ============ AUTHENTICATION ============

export async function engineerLogin(email: string, password: string) {
  try {
    console.log('Logging in engineer...');
    const user = await loginUser(email, password);

    console.log('Login successful');
    console.log(`User: ${user.firstName} ${user.lastName}`);
    console.log(`Role: ${user.role}`);
    console.log(`Team: ${user.teamId || 'Not assigned'}`);

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logout() {
  try {
    console.log('Logging out...');
    await logoutUser();
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

// ============ ADMIN - APPROVE NEW USER ============

export async function adminApproveNewUser(userId: string) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== 'Administrator') {
      throw new Error('Only Administrators can approve users');
    }

    console.log('Approving user...');
    await approveUser(userId);

    console.log('User approved successfully');
  } catch (error) {
    console.error('Error approving user:', error);
    throw error;
  }
}

// ============ DASHBOARDS ============

export async function teamLeaderViewDashboard(teamId: string) {
  try {
    console.log('Loading team performance dashboard...');
    const dashboard = await getTeamPerformanceDashboard(teamId);

    console.log('Team Performance Dashboard');
    console.log(`Period: ${dashboard.periods.join(' → ')}`);
    console.log('Metrics:');

    dashboard.metrics.forEach((metric, index) => {
      console.log(`  ${dashboard.periods[index]}:`);
      console.log(`    - Tasks Assigned: ${metric.totalTasksAssigned}`);
      console.log(`    - Tasks Completed: ${metric.totalTasksCompleted}`);
      console.log(`    - Performance Score: ${Math.round(metric.performanceScore)}/100`);
      console.log(`    - Avg Completion Time: ${metric.averageCompletionTime.toFixed(1)} hours`);
    });

    console.log(`Trend: ${dashboard.trend}`);

    return dashboard;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    throw error;
  }
}

export async function dmaManagerViewDashboard(dmaId: string) {
  try {
    console.log('Loading DMA performance dashboard...');
    const dashboard = await getDMAPerformanceDashboard(dmaId);

    console.log('DMA Performance Dashboard');
    dashboard.metrics.forEach((metric, index) => {
      console.log(`  ${dashboard.periods[index]}:`);
      console.log(`    - Reports Received: ${metric.totalReportsReceived}`);
      console.log(`    - Reports Resolved: ${metric.totalReportsResolved}`);
      console.log(`    - Performance Score: ${Math.round(metric.performanceScore)}/100`);
    });

    return dashboard;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    throw error;
  }
}

export async function utilityManagerViewAnalytics(utilityId: string) {
  try {
    console.log('Loading utility analytics...');
    const analytics = await getUtilityAnalytics(utilityId);

    console.log('Utility Analytics');
    console.log(`Total Reports: ${analytics.totalReports}`);
    console.log(`Resolved: ${analytics.resolved}`);
    console.log(`Resolution Rate: ${analytics.resolutionRate.toFixed(1)}%`);

    console.log('By Priority:');
    Object.entries(analytics.byPriority).forEach(([priority, count]) => {
      console.log(`  - ${priority}: ${count}`);
    });

    console.log('By Type:');
    Object.entries(analytics.byType).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });

    return analytics;
  } catch (error) {
    console.error('Error loading analytics:', error);
    throw error;
  }
}

// ============ DMA MANAGER - VIEW REPORTS ============

export async function dmaManagerViewReports(dmaId: string) {
  try {
    console.log('Fetching reports for DMA...');
    const reports = await getReportsForDMA(dmaId);

    console.log(`Total reports: ${reports.length}`);

    const byStatus = {
      New: reports.filter((r) => r.status === 'New').length,
      Assigned: reports.filter((r) => r.status === 'Assigned').length,
      InProgress: reports.filter((r) => r.status === 'InProgress').length,
      RepairSubmitted: reports.filter((r) => r.status === 'RepairSubmitted').length,
      Closed: reports.filter((r) => r.status === 'Closed').length,
    };

    console.log('Reports by status:');
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count}`);
    });

    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
}

// ============ TEAM LEADER - VIEW ASSIGNED TASKS ============

export async function teamLeaderViewAssignedTasks(teamId: string) {
  try {
    console.log('Fetching assigned tasks...');
    const reports = await getReportsForTeam(teamId);

    console.log(`Total tasks: ${reports.length}`);

    const byStatus = {
      Assigned: reports.filter((r) => r.status === 'Assigned').length,
      InProgress: reports.filter((r) => r.status === 'InProgress').length,
      RepairSubmitted: reports.filter((r) => r.status === 'RepairSubmitted').length,
      Closed: reports.filter((r) => r.status === 'Closed').length,
    };

    console.log('Tasks by status:');
    Object.entries(byStatus).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count}`);
    });

    // Show detailed info for each task
    reports.forEach((report) => {
      console.log(`\nReport: ${report.trackingId}`);
      console.log(`  Priority: ${report.priority}`);
      console.log(`  Status: ${report.status}`);
      console.log(`  Location: ${report.location.address || `${report.location.latitude}, ${report.location.longitude}`}`);
    });

    return reports;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

// ============ WORKFLOW TIMELINE ============

/**
 * Complete workflow from report submission to approval
 */
export async function completeWorkflowExample() {
  try {
    console.log('=== HYDRANET WORKFLOW EXAMPLE ===\n');

    // 1. Public submits report
    console.log('STEP 1: Public submits leakage report');
    const report = await submitPublicLeakageReport();

    // 2. DMA Manager gets notification and assigns to team
    console.log('\nSTEP 2: DMA Manager assigns to team');
    // In real app: Get teamId and teamLeaderId from database
    // await dmaManagerAssignReport(report.id, 'team-001', 'leader-001');

    // 3. Team Leader starts working and updates status
    console.log('\nSTEP 3: Team Leader updates status to InProgress');
    // await updateReportStatus(report.id, 'InProgress', 'team-leader-001');

    // 4. Team Leader submits repair completion with photos
    console.log('\nSTEP 4: Team Leader submits repair');
    // const submission = await teamLeaderSubmitRepair(report.id, 'team-001', 'leader-001');

    // 5. DMA Manager approves repair
    console.log('\nSTEP 5: DMA Manager approves repair');
    // await dmaManagerApproveRepair(submission.id);

    console.log('\n=== WORKFLOW COMPLETE ===');
  } catch (error) {
    console.error('Workflow error:', error);
  }
}
