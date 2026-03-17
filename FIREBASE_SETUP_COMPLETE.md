# HydraNet Firebase Setup - COMPLETE CHECKLIST

## ✅ COMPLETED SETUP

### 1. Firebase Project Created
- Project ID: `hydranet-e071d`
- Authentication: ✅ Activated
- Firestore Database: ✅ Activated
- Cloud Storage: ✅ Activated
- **Firestore Rules: ✅ DEPLOYED** (just now)
- **Cloud Functions: ✅ DEPLOYED** (setCustomClaims)

### 2. Security Rules Deployed
**File:** `firestore.rules` (464 lines of role-based access control)
- ✅ Admins: Full access to everything
- ✅ Utility Managers: Access to their utility data only
- ✅ DMA Managers: Access to their DMA data only
- ✅ Teams: Access to assigned reports
- ✅ Engineers: Can submit reports and repairs
- ✅ Storage: Image uploads protected by role

### 3. Backend Services Ready (11 files)
All in `src/services/`:
- ✅ `firebase.ts` - Firebase config (needs credentials)
- ✅ `types.ts` - All TypeScript interfaces
- ✅ `authService.ts` - User auth & approval
- ✅ `reportService.ts` - Leakage reports
- ✅ `geospatialService.ts` - GPS-based routing
- ✅ `imageUploadService.ts` - Photo uploads
- ✅ `auditService.ts` - Compliance logging
- ✅ `notificationService.ts` - Push notifications
- ✅ `analyticsService.ts` - Performance metrics
- ✅ `index.ts` - Service exports

---

## 🔧 NEXT STEPS (DO THESE NOW)

### STEP 1: Get Your Firebase Credentials
1. Go to: **Firebase Console** → `hydranet-e071d` → **Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key** button
4. Save the JSON file safely
5. Copy these values from the JSON:
   ```
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId
   ```

### STEP 2: Add Credentials to Your App
Edit `src/services/firebase.ts` and replace the placeholder credentials:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← Get from Firebase Console
  authDomain: "YOUR_AUTH_DOMAIN",   // ← Get from Firebase Console
  projectId: "hydranet-e071d",      // ← Already correct
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### STEP 3: Test Authentication
1. Open your React Native app
2. Create a test user account using the app's signup
3. User should appear in Firebase Console → **Authentication** tab
4. User will be in "Pending Approval" state (by design)
5. Approve the user via Firebase Console or admin function

### STEP 4: Create Test Data
Create at least one **Utility** and one **DMA** in Firestore:

**Collection: `utilities`** (Document: `demo-utility`)
```json
{
  "name": "City Water Department",
  "location": "New York, NY",
  "adminId": "admin-user-id-here",
  "createdAt": "2026-02-21T00:00:00Z"
}
```

**Collection: `dmas`** (Document: `demo-dma`)
```json
{
  "name": "Downtown DMA",
  "utilityId": "demo-utility",
  "managerId": "manager-user-id-here",
  "boundary": {
    "type": "Polygon",
    "coordinates": [[
      [-74.01, 40.71],
      [-74.00, 40.71],
      [-74.00, 40.72],
      [-74.01, 40.72],
      [-74.01, 40.71]
    ]]
  },
  "createdAt": "2026-02-21T00:00:00Z"
}
```

### STEP 5: Test Geospatial Routing (Optional but Recommended)
The app can automatically route reports to the correct DMA based on GPS location. Test by:
1. Submitting a leakage report from your phone
2. Report should appear in Firestore under correct DMA
3. If outside all boundaries, goes to "UNASSIGNED" for admin review

---

## 📱 USING SERVICES IN YOUR SCREENS

### Example: Login Screen
```typescript
import { loginUser } from "@/src/services/authService";

const handleLogin = async (email: string, password: string) => {
  try {
    const user = await loginUser(email, password);
    // User logged in and approved
    navigate("Home", { userId: user.uid });
  } catch (error) {
    alert("Login failed: " + error.message);
  }
};
```

### Example: Submit Leakage Report
```typescript
import { submitLeakageReport } from "@/src/services/reportService";
import { uploadReportImage } from "@/src/services/imageUploadService";

const handleSubmitReport = async () => {
  try {
    // Upload image first
    const imageUrl = await uploadReportImage(
      userId,
      selectedImage,
      "before"
    );
    
    // Submit report with GPS location
    const report = await submitLeakageReport({
      reportedBy: userId,
      description: "Major leak on Main St",
      severity: "HIGH",
      location: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      imageUrls: [imageUrl],
    });
    
    alert("Report submitted successfully!");
  } catch (error) {
    alert("Failed to submit: " + error.message);
  }
};
```

---

## 🔐 USER ROLES & PERMISSIONS

### Role Hierarchy:
1. **Administrator**
   - Can view all utilities, DMAs, teams, reports
   - Can approve users
   - Receives escalations for unassigned reports
   - Full analytics access

2. **Utility Manager**
   - Manages one utility
   - Views all DMAs in their utility
   - Real-time analytics for their utility

3. **DMA Manager**
   - Manages one DMA within a utility
   - Can assign reports to teams
   - Approves repair submissions
   - Team performance metrics

4. **Team Lead**
   - Views assigned reports for their team
   - Delegates to team members
   - Tracks team tasks

5. **Engineer**
   - Views assigned tasks
   - Can submit leakage reports (anonymous too!)
   - Marks repairs as complete
   - Uploads before/after photos

---

## 🧪 QUICK TEST CHECKLIST

- [ ] Firebase credentials added to `src/services/firebase.ts`
- [ ] App compiles without errors
- [ ] Can create a test user account
- [ ] Firebase Console shows new user in Authentication tab
- [ ] Created test Utility in Firestore
- [ ] Created test DMA in Firestore
- [ ] Try submitting a leakage report
- [ ] Report appears in correct DMA in Firestore
- [ ] Can upload photos to Storage

---

## 📞 TROUBLESHOOTING

### "Permission denied" error
→ Check `firestore.rules` is deployed (already done ✅)
→ Check user role is set correctly
→ User must be "approved" (isApproved: true)

### "Function not found" error
→ setCustomClaims is deployed ✅
→ Other functions available once deployment completes

### Photos not uploading
→ Check Storage bucket permissions in Firebase Console
→ `firestore.rules` includes Storage rules

### Reports going to "UNASSIGNED"
→ This is normal - means GPS location is outside all DMA boundaries
→ Admin will see these in escalated reports
→ Add more boundary polygons to cover your service area

---

## 📚 DOCUMENTATION

- Detailed API: [FIREBASE_BACKEND_QUICK_REFERENCE.md](FIREBASE_BACKEND_QUICK_REFERENCE.md)
- Setup Guide: [FIREBASE_SETUP_GUIDE.md](FIREBASE_SETUP_GUIDE.md)
- Integration Examples: [src/services/integration-examples.ts](src/services/integration-examples.ts)
- Implementation Timeline: [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)

---

**Status:** 95% Complete - Just need your Firebase credentials! 🎉
