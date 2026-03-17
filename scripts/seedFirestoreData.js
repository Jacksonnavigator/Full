/**
 * Seed Firebase Firestore with test data
 * Run this once: node scripts/seedFirestoreData.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'hydranet-e071d',
  });
} catch (error) {
  console.error('❌ Error: serviceAccountKey.json not found!');
  process.exit(1);
}

const db = admin.firestore();

const mockReports = [
  {
    id: 'TASK-001',
    title: 'Burst Pipe at Main Street',
    description: 'Water leaking near the school junction. Significant flow across the road surface.',
    priority: 'High',
    status: 'Assigned',
    latitude: -3.366,
    longitude: 36.683,
    severity: 'high',
    imageUrl: '',
    createdBy: 'engineer@test.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    assignedTeamId: 'team-1',
    assignedTeam: 'team-1',
    utilityId: 'util-1',
    dmaId: 'dma-1',
    teamLeader: 'Test Team Leader',
    branch: 'Central',
    reporterPhotos: ['https://via.placeholder.com/300', 'https://via.placeholder.com/300'],
  },
  {
    id: 'TASK-002',
    title: 'Low Pressure in Residential Block B',
    description: 'Residents reporting low water pressure during peak hours.',
    priority: 'Medium',
    status: 'In Progress',
    latitude: -3.365,
    longitude: 36.681,
    severity: 'medium',
    imageUrl: '',
    createdBy: 'engineer@test.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    assignedTeamId: 'team-1',
    assignedTeam: 'team-1',
    utilityId: 'util-1',
    dmaId: 'dma-1',
    teamLeader: 'Test Team Leader',
    branch: 'East',
    reporterPhotos: ['https://via.placeholder.com/300'],
  },
  {
    id: 'TASK-003',
    title: 'Valve Leak at Industrial Zone',
    description: 'Visible leak around main valve chamber near factory entrance. High priority industrial consumer.',
    priority: 'High',
    status: 'In Progress',
    latitude: -3.368,
    longitude: 36.686,
    severity: 'high',
    imageUrl: '',
    createdBy: 'engineer@test.com',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    assignedTeamId: 'team-1',
    assignedTeam: 'team-1',
    utilityId: 'util-1',
    dmaId: 'dma-1',
    teamLeader: 'Test Team Leader',
    branch: 'Industrial',
    reporterPhotos: ['https://via.placeholder.com/300'],
  },
];

async function seedFirestore() {
  console.log('🚀 Seeding Firestore with test reports...\n');

  try {
    // Create a batch for atomic writes
    const batch = db.batch();

    for (const report of mockReports) {
      const docRef = db.collection('reports').doc(report.id);
      batch.set(docRef, report);
      console.log(`✓ Prepared: ${report.id} - ${report.title}`);
    }

    // Commit the batch
    await batch.commit();
    console.log('\n✅ Firestore seeding complete!');
    console.log(`📊 Added ${mockReports.length} test reports to "reports" collection`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

seedFirestore();
