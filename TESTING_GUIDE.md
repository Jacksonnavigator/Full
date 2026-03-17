# 🧪 TESTING & SETUP GUIDE

## STEP 1: Test Firebase Connection

Run your app to verify Firebase connects:
```bash
npm start
```

**Verify connection by checking the console:**
- If you see no errors → Firebase is connected ✅
- If you see "permission denied" → Check firebase.ts credentials ✅ (they look good!)

---

## STEP 2: Create Test Users in Firebase Console

### Create Admin User:
1. Go to **Firebase Console** → **hydranet-e071d** → **Authentication**
2. Click **Add User** (or users can self-register via your app)
3. Create user:
   ```
   Email: admin@hydranet.test
   Password: Admin123!@#
   ```
4. After user is created, go to **Firestore** and create a document:

**Collection: `users` → Document ID: `{userId}` (use the UID from Authentication)**
```json
{
  "email": "admin@hydranet.test",
  "role": "Administrator",
  "firstName": "Admin",
  "lastName": "User",
  "isApproved": true,
  "utilityId": "demo-utility",
  "createdAt": "2026-02-21T00:00:00Z",
  "profilePhoto": ""
}
```

### Create Manager User:
```
Email: manager@hydranet.test
Password: Manager123!@#
```

**Collection: `users` → Document ID: `{userId}`**
```json
{
  "email": "manager@hydranet.test",
  "role": "Utility Manager",
  "firstName": "John",
  "lastName": "Manager",
  "isApproved": true,
  "utilityId": "demo-utility",
  "createdAt": "2026-02-21T00:00:00Z",
  "profilePhoto": ""
}
```

### Create Engineer User:
```
Email: engineer@hydranet.test
Password: Engineer123!@#
```

**Collection: `users` → Document ID: `{userId}`**
```json
{
  "email": "engineer@hydranet.test",
  "role": "Engineer",
  "firstName": "Jane",
  "lastName": "Engineer",
  "isApproved": true,
  "utilityId": "demo-utility",
  "teamId": "demo-team",
  "createdAt": "2026-02-21T00:00:00Z",
  "profilePhoto": ""
}
```

---

## STEP 3: Create Test Organizational Data

### Create Utility
**Collection: `utilities` → Document ID: `demo-utility`**
```json
{
  "name": "City Water Department",
  "location": "New York, NY",
  "adminId": "{use-admin-userId}",
  "createdAt": "2026-02-21T00:00:00Z"
}
```

### Create DMA (District Meter Area)
**Collection: `dmas` → Document ID: `demo-dma`**
```json
{
  "name": "Downtown DMA",
  "utilityId": "demo-utility",
  "managerId": "{use-manager-userId}",
  "boundary": {
    "type": "Polygon",
    "coordinates": [[
      [-74.0060, 40.7128],
      [-74.0050, 40.7128],
      [-74.0050, 40.7138],
      [-74.0060, 40.7138],
      [-74.0060, 40.7128]
    ]]
  },
  "createdAt": "2026-02-21T00:00:00Z"
}
```

### Create Team
**Collection: `teams` → Document ID: `demo-team`**
```json
{
  "name": "Downtown Repair Team",
  "dmaId": "demo-dma",
  "utilityId": "demo-utility",
  "leadId": "{use-manager-userId}",
  "members": ["{use-engineer-userId}"],
  "createdAt": "2026-02-21T00:00:00Z"
}
```

---

## STEP 4: Test Authentication Flow

### Using LoginScreen:
1. Open your app
2. Go to **LoginScreen**
3. Enter: `admin@hydranet.test` / `Admin123!@#`
4. Click Login

**Expected result:**
- ✅ Successfully logs in
- ✅ Redirects to main screen
- ✅ Can see user profile

---

## STEP 5: Test Leakage Report Submission

### Quick Test Function (add to a test screen):
```typescript
import { submitLeakageReport } from "@/src/services/reportService";
import { uploadReportImage } from "@/src/services/imageUploadService";
import * as Location from 'expo-location';

const testReportSubmission = async () => {
  try {
    // Get current location
    const location = await Location.getCurrentPositionAsync({});
    
    const report = await submitLeakageReport({
      reportedBy: "engineer@hydranet.test", // or actual user ID
      description: "Test leak report",
      severity: "MEDIUM",
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      imageUrls: [],
    });
    
    console.log("✅ Report created:", report);
    alert("Report submitted successfully!");
    
  } catch (error) {
    console.error("❌ Error:", error);
    alert("Failed: " + error.message);
  }
};
```

**Expected result:**
- ✅ Report appears in Firestore under correct DMA
- ✅ If location outside all DMAs → goes to "UNASSIGNED"
- ✅ Admin can see it in escalations

---

## STEP 6: Test Image Upload

```typescript
import { uploadReportImage } from "@/src/services/imageUploadService";

const testImageUpload = async (image) => {
  try {
    const url = await uploadReportImage(
      "engineer@hydranet.test",
      image,
      "before"
    );
    
    console.log("✅ Image uploaded:", url);
    alert("Upload successful!");
    
  } catch (error) {
    alert("Upload failed: " + error.message);
  }
};
```

**Expected result:**
- ✅ Image uploaded to Firebase Storage
- ✅ Returns accessible URL
- ✅ Can add to reports

---

## STEP 7: Verify Firestore Rules Working

### Test Permission Denial:
1. Log in as **Engineer**
2. Try to view users list (not allowed)
3. Should get **permission denied error** ✅

This means rules are working!

---

## COMMON ISSUES & FIXES

### Issue: "Firebase is not initialized"
**Fix:** Make sure you didn't skip Step 1 (test connection)

### Issue: "Permission denied" when submitting reports
**Fix:** 
1. Verify user has `isApproved: true` in Firestore
2. Check user role is correctly set
3. Verify firestore.rules are deployed (they are ✅)

### Issue: Image uploads not working
**Fix:**
1. Check Storage permissions in Firebase Console
2. Verify user is authenticated
3. Check device has file permissions

### Issue: Report not routing to correct DMA
**Fix:**
1. Your location is outside the boundary polygon
2. Increase the boundary coordinates to cover your test area
3. Or use coordinates that are WITHIN the boundary

---

## ✅ QUICK CHECKLIST

- [ ] App runs without Firebase errors
- [ ] Created 3 test users in Authentication
- [ ] Created user documents in Firestore with correct roles
- [ ] Created Utility, DMA, and Team documents
- [ ] Can log in with admin account
- [ ] Can submit a leakage report
- [ ] Report appears in correct DMA in Firestore
- [ ] Can upload images to Storage

---

## NEXT: Integrate Services into Your Screens

After testing is complete, see: **FIREBASE_BACKEND_QUICK_REFERENCE.md** for how to integrate services into all your screens.

