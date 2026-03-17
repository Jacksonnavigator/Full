# HydraNet Firebase Backend - Complete Documentation

## 📋 Overview

HydraNet is a **hierarchical, geo-governed water leakage reporting and maintenance management system**. This Firebase backend enables:

✅ **Public Reporting** - Anonymous water leakage reports with photo documentation  
✅ **Hierarchical Management** - Administrator → Utility Manager → DMA Manager → Teams → Engineers  
✅ **Geospatial Routing** - Automatic report routing based on GPS location  
✅ **Workflow Management** - Complete task lifecycle from report to approval  
✅ **Real-time Notifications** - Push notifications for all stakeholders  
✅ **Performance Analytics** - KPIs and metrics for teams and utilities  
✅ **Audit Trail** - Comprehensive logging for compliance  
✅ **Image Management** - Secure cloud storage for all documentation  

## 🎯 System Architecture

### Role Hierarchy

```
┌─────────────────────────────────────────────────┐
│         Administrator (System Level)            │  - Global oversight
│         ├─ Monitor all utilities                │  - Manage backups
│         └─ Approve system-wide policies         │  - Escalations
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│         Utility Manager (Utility Level)         │  - Multi-DMA oversight
│         ├─ Manage DMA managers                  │  - Utility-wide analytics
│         └─ Monitor utility performance          │  - Budget oversight
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│         DMA Manager (Operational Level)         │  - 1 DMA focus
│         ├─ Create branches                      │  - Assign tasks
│         ├─ Manage teams                         │  - Review submissions
│         └─ Approve repairs                      │  - Quality assurance
└─────────────────────────────────────────────────┘
                    ↙       ↘
    ┌──────────────┐  ┌──────────────┐
    │   Branch 1   │  │   Branch 2   │
    │   (Teams)    │  │   (Teams)    │
    └──────────────┘  └──────────────┘
          ↓                ↓
    ┌──────────────┐  ┌──────────────┐
    │   Team 1     │  │   Team 2     │
    │ (Engineers   │  │ (Engineers   │
    │  + Leader)   │  │  + Leader)   │
    └──────────────┘  └──────────────┘

Public (Anonymous)
└─ Submit leakage report without login
```

### Data Flow

```
Public Report Submission
         ↓
[Geospatial Routing - Find Utility & DMA]
         ↓
         ├─ If DMA found → Assign to DMA Manager
         ├─ If Utility only → Assign to Utility Manager
         └─ If nothing → Escalate to Administrator
         ↓
DMA Manager Reviews & Assigns to Team
         ↓
Team Leader & Engineers Execute Repair
         ↓
Team Leader Submits Completion with Photos
         ↓
DMA Manager Reviews & Approves
         ↓
Report Closed & Archived
         ↓
Performance Metrics Calculated
```

## 📁 Project Structure

### Services Layer

```typescript
src/services/
├── firebase.ts                    # Firebase initialization
├── types.ts                       # All TypeScript interfaces
├── authService.ts                 # Authentication & user management
├── reportService.ts               # Report submission & task management
├── geospatialService.ts          # Location-based routing logic
├── imageUploadService.ts         # Image uploads to Firebase Storage
├── auditService.ts               # Audit logging for compliance
├── notificationService.ts        # Push notifications
├── analyticsService.ts           # Performance metrics calculation
├── index.ts                      # Central export
└── integration-examples.ts       # Usage examples
```

### Root Configuration Files

```
FIREBASE_SETUP_GUIDE.md              # Step-by-step setup (complete guide)
FIREBASE_BACKEND_QUICK_REFERENCE.md  # Quick lookup reference
firestore.rules                      # Firestore security rules
functions-template.js               # Cloud Functions (backend logic)
```

## 🚀 Getting Started

### Step 1: Firebase Project Setup (30 minutes)

1. Create Firebase project at https://console.firebase.google.com/
2. Enable Firestore, Authentication, and Storage
3. Get Firebase config credentials
4. Update `src/services/firebase.ts` with your credentials

See [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) for detailed steps.

### Step 2: Deploy Security Rules (10 minutes)

1. Copy `firestore.rules` content
2. Go to Firestore Console > Rules
3. Paste and publish the rules

**What these rules do:**
- Admin access to everything
- Utility Managers see only their utility
- DMA Managers see only their DMA
- Engineers see only their team's reports
- Public can submit reports

### Step 3: Deploy Cloud Functions (20 minutes)

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init functions`
3. Copy `functions-template.js` to your `functions/index.js`
4. Install dependencies: `npm install`
5. Deploy: `firebase deploy --only functions`

**What Cloud Functions do:**
- Set custom JWT claims for security
- Auto-route unassigned reports
- Create audit logs automatically
- Send notifications to managers
- Calculate monthly performance metrics
- Clean up old notifications

### Step 4: Load Geospatial Data (30 minutes)

Add boundary data for your Utilities and DMAs using services:

```typescript
import { db } from './services';
import { addDoc, collection } from 'firebase/firestore';

// Add utility with GeoJSON boundary
await addDoc(collection(db, 'utilities'), {
  name: 'City Water Authority',
  code: 'CWA',
  geoBoundary: {
    type: 'Polygon',
    coordinates: [[[lon, lat], [lon, lat], ...]] // GeoJSON format
  }
});

// Add DMA with GeoJSON boundary
await addDoc(collection(db, 'dmas'), {
  name: 'Central District',
  utilityId: 'utility-001',
  geoBoundary: {
    type: 'Polygon',
    coordinates: [[[lon, lat], [lon, lat], ...]]
  }
});
```

**Tools for creating boundaries:**
- https://geojson.io - Visual GeoJSON editor
- https://labs.mapbox.com/drawing-tool/ - Mapbox tool
- Google My Maps - Export as KML then convert to GeoJSON

### Step 5: Create Initial Users

```typescript
import { registerUser, approveUser } from './services';

// Admin creates manager
const managerId = await registerUser(
  'manager@water.gov',
  'SecurePassword123',
  {
    firstName: 'John',
    lastName: 'Manager',
    role: 'DMAManager',
    utilityId: 'util-001',
    dmaId: 'dma-001',
    isApproved: false
  }
);

// Admin approves
await approveUser(managerId);

// Manager logs in
const user = await loginUser('manager@water.gov', 'SecurePassword123');
```

## 💻 Usage Examples

### Example 1: Public Submits Leakage Report

```typescript
import { submitLeakageReport, uploadReportImage } from './services';
import * as Location from 'expo-location';

// Get GPS location
const location = await Location.getCurrentPositionAsync({});

// Upload photos (max 4)
const imageUrl1 = await uploadReportImage('temp', imageUri1);
const imageUrl2 = await uploadReportImage('temp', imageUri2);

// Submit report
const report = await submitLeakageReport(
  'Water gushing from burst main pipe near market',
  {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  },
  'Critical',      // Priority level
  'BurstPipeline', // Report type
  [imageUrl1, imageUrl2] // Uploaded image URLs
);

// Show tracking ID to user
console.log(`Report submitted! Track it with ID: ${report.trackingId}`);
```

**System automatically:**
- Detects location via GPS
- Finds correct Utility & DMA
- Routes to DMA Manager
- Sends notification to manager
- Creates audit log entry

### Example 2: DMA Manager Assigns Report to Team

```typescript
import { assignReportToTeam, getReportsForDMA } from './services';

// Get all reports for my DMA
const reports = await getReportsForDMA('dma-001');

// Find unassigned report
const unassignedReport = reports.find(r => r.status === 'New');

// Assign to team
await assignReportToTeam(
  unassignedReport.id,
  'team-001',      // Team ID
  'leader-001',    // Team Leader ID
  userId           // Manager's ID
);

// System automatically:
// - Updates report status to 'Assigned'
// - Notifies team leader
// - Creates activity log
// - Logs audit trail
```

### Example 3: Team Leader Submits Repair Completion

```typescript
import { submitRepairCompletion, uploadSubmissionImage } from './services';

// Upload before photos
const beforeUrl1 = await uploadSubmissionImage(reportId, before1, 'before');
const beforeUrl2 = await uploadSubmissionImage(reportId, before2, 'before');

// Upload after photos
const afterUrl1 = await uploadSubmissionImage(reportId, after1, 'after');
const afterUrl2 = await uploadSubmissionImage(reportId, after2, 'after');

// Submit repair completion
const submission = await submitRepairCompletion(
  reportId,
  teamLeaderId,
  teamId,
  [beforeUrl1, beforeUrl2],
  [afterUrl1, afterUrl2],
  'Burst section of 2" main removed and replaced. Pressure tested to 80 PSI.',
  ['2" PVC Pipe', 'Coupling Adapter', 'Teflon Tape', 'Joint Sealant']
);

// System automatically:
// - Changes report status to 'RepairSubmitted'
// - Notifies DMA Manager for review
// - Logs all materials used
// - Stores before/after images in Cloud Storage
```

### Example 4: DMA Manager Approves Repair

```typescript
import { approveRepairSubmission } from './services';

// Review the submission...
// Check before/after photos
// Review repair notes and materials

// Approve if satisfied
await approveRepairSubmission(
  submissionId,
  'Excellent work. All requirements met. Report approved for closure.',
  managerId
);

// System automatically:
// - Changes submission status to 'Approved'
// - Changes report status to 'Closed'
// - Sets closedAt timestamp
// - Notifies team leader
// - Calculates completion metrics
```

### Example 5: View Performance Dashboard

```typescript
import { getTeamPerformanceDashboard } from './services';

// Team Leader views their team's performance
const dashboard = await getTeamPerformanceDashboard('team-001');

console.log(`Last 3 months performance:`);
dashboard.metrics.forEach(metric => {
  console.log(`${metric.period}:
    - Tasks: ${metric.totalTasksCompleted}/${metric.totalTasksAssigned}
    - Score: ${metric.performanceScore}/100
    - Avg Time: ${metric.averageCompletionTime}h
  `);
});

console.log(`Trend: ${dashboard.trend}`); // improving|declining|stable
```

### Example 6: View Utility Analytics

```typescript
import { getUtilityAnalytics } from './services';

// Utility Manager views utility-wide analytics
const analytics = await getUtilityAnalytics('util-001');

console.log(`Utility Performance:
  - Reports Received: ${analytics.totalReports}
  - Resolved: ${analytics.resolved}
  - Resolution Rate: ${analytics.resolutionRate}%
  
  Critical Issues: ${analytics.byPriority.Critical}
  High Issues: ${analytics.byPriority.High}
  
  Burst Pipelines: ${analytics.byType.BurstPipeline}
  Distribution Failures: ${analytics.byType.DistributionFailure}
`);
```

## 🔐 Security Features

### Authentication
- Email/Password authentication
- Custom JWT claims for role-based access
- Approval workflow for new users
- Secure password storage

### Authorization (Firestore Rules)
- **Admins**: Full system access
- **Utility Managers**: See only their utility's data
- **DMA Managers**: See only their DMA's data
- **Engineers/Leaders**: See only their team's reports
- **Public**: Can only submit reports

### Data Protection
- HTTPS encryption for all communications
- Firestore encryption at rest
- Cloud Storage encryption
- Audit logging of all actions
- Immutable audit trail
- Data isolation by role

### Image Security
- Direct upload to Cloud Storage (bypasses backend)
- Secure download URLs with expiration
- Virus scanning (recommended)
- EXIF data stripping (recommended)

## 📊 Data Models

### Core Collections

**utilities** - Water service areas
```json
{
  "id": "util-001",
  "name": "City Water Authority",
  "code": "CWA",
  "geoBoundary": { "type": "Polygon", "coordinates": [...] },
  "isActive": true
}
```

**dmas** - District Metered Areas
```json
{
  "id": "dma-001",
  "utilityId": "util-001",
  "name": "Central District",
  "geoBoundary": { "type": "Polygon", "coordinates": [...] }
}
```

**users** - All system users
```json
{
  "id": "uid-001",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Engineer",
  "role": "Engineer",
  "utilityId": "util-001",
  "dmaId": "dma-001",
  "teamId": "team-001",
  "isApproved": true
}
```

**reports** - Leakage reports
```json
{
  "id": "report-001",
  "trackingId": "HN-ABC123DEF",
  "description": "Burst pipeline at junction",
  "status": "Closed",
  "priority": "High",
  "type": "BurstPipeline",
  "location": { "latitude": 40.7128, "longitude": -74.0060 },
  "images": [
    { "url": "https://...", "uploadedAt": "2026-02-18T..." }
  ],
  "utilityId": "util-001",
  "dmaId": "dma-001",
  "assignedTeamId": "team-001",
  "createdAt": "2026-02-18T...",
  "closedAt": "2026-02-18T..."
}
```

**submissions** - Repair completions
```json
{
  "id": "submission-001",
  "reportId": "report-001",
  "beforeImages": [...],
  "afterImages": [...],
  "repairNotes": "Pipe replaced, tested at 80 PSI",
  "materialsUsed": ["PVC Pipe", "Coupling", "Sealant"],
  "status": "Approved",
  "approvedBy": "manager-001",
  "approvedAt": "2026-02-18T..."
}
```

**auditLogs** - Compliance trail
```json
{
  "id": "audit-001",
  "action": "REPORT_CREATED",
  "userId": "anonymous",
  "resourceType": "Report",
  "resourceId": "report-001",
  "timestamp": "2026-02-18T...",
  "details": { "priority": "High" }
}
```

See [src/services/types.ts](./src/services/types.ts) for complete definitions.

## 📈 Analytics & Metrics

### Team Metrics (Monthly)
- `totalTasksAssigned` - Reports assigned to team
- `totalTasksCompleted` - Successfully closed
- `totalTasksRejected` - Rejected submissions
- `averageCompletionTime` - Hours to complete (avg)
- `performanceScore` - 0-100 rating
- `responseTimeAverage` - Minutes to start work

### DMA Metrics (Monthly)
- `totalReportsReceived` - All reports in DMA
- `totalReportsResolved` - Successfully closed
- `averageResolutionTime` - Hours to resolve (avg)
- `performanceScore` - 0-100 rating based on resolution rate

### Utility Analytics
- Total reports received
- Resolution rate by priority
- Breakdown by report type
- Pending report count

## 🔧 Troubleshooting

### "Permission denied" Errors
**Cause**: Security rules blocking access  
**Solution**:
1. Verify user is approved (`isApproved: true`)
2. Check custom JWT claims are set
3. Verify role matches required permission
4. Check DMA/Utility ID matches data

### Images Not Uploading
**Cause**: Storage rules or file size issues  
**Solution**:
1. Verify file size < 10MB
2. Check CORS is configured
3. Verify Storage rules allow uploads
4. Test network connectivity

### Slow Queries
**Cause**: Missing Firestore indexes  
**Solution**:
1. Check Firestore Console for index suggestions
2. Create suggested composite indexes
3. Use pagination for large result sets
4. Add limits to queries (e.g., `limit(100)`)

### Geospatial Routing Not Working
**Cause**: Invalid GeoJSON boundaries  
**Solution**:
1. Validate GeoJSON at https://geojson.io
2. Ensure coordinates are [longitude, latitude]
3. Check polygon is closed (first == last point)
4. Verify no overlapping boundaries
5. Check utilities/DMAs are marked active

## 📋 Deployment Checklist

- [ ] **Firebase Project**
  - [ ] Firestore enabled
  - [ ] Authentication enabled
  - [ ] Cloud Storage enabled
  - [ ] Credentials in `firebase.ts`

- [ ] **Security Rules**
  - [ ] Firestore rules deployed
  - [ ] Storage rules deployed
  - [ ] Tested in Firestore emulator
  - [ ] Tested in staging environment

- [ ] **Cloud Functions**
  - [ ] Functions deployed
  - [ ] Triggers verified
  - [ ] Error logging configured
  - [ ] Performance monitored

- [ ] **Geospatial Data**
  - [ ] Utilities created with boundaries
  - [ ] DMAs created with boundaries
  - [ ] Boundaries tested with test reports
  - [ ] No overlaps between boundaries

- [ ] **Users**
  - [ ] Admin user created
  - [ ] Test managers created
  - [ ] Test teams created
  - [ ] Test engineers created

- [ ] **Testing**
  - [ ] Public report submission works
  - [ ] Geospatial routing works
  - [ ] Image uploads work
  - [ ] Manager approval works
  - [ ] Notifications sent
  - [ ] Audit logs created
  - [ ] Metrics calculated

- [ ] **Production Setup**
  - [ ] Backups enabled
  - [ ] Monitoring alerts configured
  - [ ] Error logging enabled
  - [ ] Rate limiting configured
  - [ ] Read/write quotas set
  - [ ] CDN configured (optional)

## 🆘 Support

### Documentation
- [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md) - Complete setup instructions
- [FIREBASE_BACKEND_QUICK_REFERENCE.md](./FIREBASE_BACKEND_QUICK_REFERENCE.md) - Quick lookup
- [src/services/types.ts](./src/services/types.ts) - All interfaces
- [src/services/integration-examples.ts](./src/services/integration-examples.ts) - Usage examples

### External Resources
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [GeoJSON Specification](https://tools.ietf.org/html/rfc7946)

### Common Questions

**Q: Can the same person be in multiple teams?**  
A: No. Each person belongs to exactly one team (enforced at registration).

**Q: Can reports span multiple DMAs?**  
A: No. Each report is routed to a single DMA based on GPS coordinates.

**Q: How are metrics calculated?**  
A: Automatically via Cloud Functions on the 1st of each month.

**Q: Can I export reports data?**  
A: Yes, via Firestore export in Console or programmatically via queries.

**Q: What if GPS location is outside all boundaries?**  
A: Report is marked as 'UNASSIGNED' and escalated to Administrator.

## 📝 Version History

- **v1.0.0** (2026-02-18) - Initial release
  - Public report submission
  - User authentication & roles
  - Geospatial routing
  - Image uploads
  - Approval workflow
  - Performance metrics
  - Audit logging
  - Notifications

## 📄 License

This project is part of HydraNet - Integrated Water Leakage Reporting System.

---

**Last Updated**: February 18, 2026  
**Status**: Production Ready  
**Next Review**: May 18, 2026
