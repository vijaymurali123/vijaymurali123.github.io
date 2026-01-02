# Firebase Setup Guide for Wedding Website

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `vijay-bindiya-wedding`
4. Accept terms and click **Continue**
5. Disable Google Analytics (optional) and click **Create project**

## Step 2: Register Your Web App

1. In Firebase console, click the **Web icon** (</>)
2. Register app name: `Wedding Website`
3. Check **"Also set up Firebase Hosting"**
4. Click **Register app**
5. Copy the Firebase configuration object

## Step 3: Update Configuration

Open `admin.js` and replace the `firebaseConfig` object with your values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 4: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (or production mode with rules)
4. Choose location (closest to your users)
5. Click **Enable**

### Firestore Security Rules (Production Mode):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read for visitors
    match /visitors/{document=**} {
      allow read, write: if request.auth != null;
      allow create: if true;
    }
    
    // Allow read for gallery
    match /gallery/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 5: Enable Firebase Storage

1. Go to **Storage** in Firebase Console
2. Click **Get started**
3. Accept default rules and click **Done**

### Storage Security Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 6: Enable Firebase Authentication

1. Go to **Authentication** in Firebase Console
2. Click **Get started**
3. Click on **Email/Password** provider
4. Enable it and click **Save**

## Step 7: Create Admin User

1. Go to **Authentication** → **Users** tab
2. Click **Add user**
3. Enter email: `vijaymurali10@yougotagift.com`
4. Enter password (make it strong!)
5. Click **Add user**

## Step 8: Test the Website

1. Visit your website: `https://vijaydiya.online`
2. Enter your name in the name gate
3. To access admin portal:
   - **Triple-click** the "V & B" logo in the navigation
   - Click the gear icon that appears
   - Login with your admin credentials

## Admin Features:

### Gallery Manager
- Upload multiple images
- Delete images
- Images automatically appear on frontend

### Visitors Tab
- See all visitors who entered the site
- View total visitors and today's visitors
- Click on any visitor to see detailed visit information

### Analytics Tab
- See which sections are most viewed
- Track user engagement

## Features Summary:

✅ **Name Gate** - Visitors must enter name before viewing  
✅ **Gallery Management** - Upload/delete images from admin  
✅ **Visitor Tracking** - Track every visitor by name  
✅ **Analytics** - See which sections are viewed most  
✅ **Section Tracking** - Automatically track which pages users visit  
✅ **Real-time Updates** - All changes reflect immediately  

## Security Notes:

1. **Admin Access**: Triple-click logo to reveal admin button
2. **Firebase Rules**: Use production rules for better security
3. **Admin Password**: Use a strong password
4. **API Keys**: Your Firebase config is safe to expose publicly

## Troubleshooting:

**Name gate not showing?**
- Clear localStorage: `localStorage.clear()`

**Images not uploading?**
- Check Storage rules
- Verify admin is logged in

**Visitors not tracking?**
- Check Firestore rules
- Open browser console for errors

## Cost:

Firebase has a generous **free tier**:
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage
- 10 GB/month data transfer

Perfect for a wedding website! 🎉
