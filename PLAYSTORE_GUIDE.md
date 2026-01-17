# 🚀 Complete Guide: Build & Upload Movever to Google Play Store

## ✅ Prerequisites Checklist

Before starting, make sure you have:
- [x] Backend deployed and running on VPS (http://168.231.124.16)
- [x] Google Play Console account ($25 one-time fee)
- [x] Expo account (free - sign up at expo.dev)
- [ ] App icon ready (Applogo.png - 1024x1024px recommended)
- [ ] Screenshots for Play Store (at least 2, recommended 1080x1920px)

---

## Step 1: Install EAS CLI

Open PowerShell and run:

```powershell
npm install -g eas-cli
```

## Step 2: Login to Expo

```powershell
cd C:\Users\DELL\Downloads\movever\Hidden_success
eas login
```

Enter your Expo credentials (or create account if you don't have one).

## Step 3: Configure Your Project

```powershell
# Initialize EAS
eas build:configure
```

When prompted:
- Select **Android**
- It will create `eas.json` (already created for you)

## Step 4: Update App Icon

Make sure your `Applogo.png` is:
- **1024x1024 pixels** (recommended)
- **PNG format**
- **Square** with no transparency for Android

If you need to resize it, use an online tool or Photoshop.

## Step 5: Build APK for Testing (Optional but Recommended)

First, let's build a test APK to make sure everything works:

```powershell
eas build --platform android --profile preview
```

This will:
1. Upload your code to Expo servers
2. Build an APK file
3. Give you a download link

**Download and test the APK on your phone** to make sure everything works!

## Step 6: Build Production AAB for Play Store

Once testing is successful, build the production version:

```powershell
eas build --platform android --profile production
```

This creates an **AAB (Android App Bundle)** file - required by Google Play Store.

**Important:** Save the download link! You'll need this AAB file.

---

## Step 7: Create Google Play Console Account

1. Go to: https://play.google.com/console
2. Sign in with your Google account
3. Pay the $25 one-time registration fee
4. Complete the account setup

## Step 8: Create Your App in Play Console

1. Click **"Create app"**
2. Fill in:
   - **App name:** Movever
   - **Default language:** English (United States)
   - **App or game:** App
   - **Free or paid:** Free
3. Accept declarations and click **"Create app"**

## Step 9: Set Up Store Listing

### App Details
- **App name:** Movever
- **Short description:** (50 characters max)
  ```
  Connect travelers with businesses for deliveries
  ```
- **Full description:** (4000 characters max)
  ```
  Movever connects travelers with businesses who need items delivered. 
  
  For Travelers:
  - Post your trips and earn money by delivering packages
  - Choose deliveries that match your route
  - Secure payments through the app
  - Build your reputation with ratings
  
  For Businesses:
  - Send packages with trusted travelers
  - Track deliveries in real-time
  - Pay only when delivered
  - Verified traveler network
  
  Features:
  ✓ Identity verification for safety
  ✓ In-app payments with Stripe
  ✓ Real-time notifications
  ✓ Rating and review system
  ✓ Secure wallet system
  ✓ GPS tracking
  ```

### App Icon
- Upload your `Applogo.png` (512x512px)

### Screenshots
You need at least **2 screenshots**. Take screenshots from:
1. Home screen
2. Trip posting screen
3. Delivery request screen
4. Wallet screen

**Recommended size:** 1080x1920px (phone screenshot)

### Category
- **App category:** Business
- **Tags:** delivery, logistics, travel

## Step 10: Content Rating

1. Go to **"Content rating"**
2. Fill out the questionnaire
3. Select **"No"** for violence, mature content, etc.
4. Submit for rating

## Step 11: Set Up App Access

1. Go to **"App access"**
2. If your app requires login:
   - Select **"All or some functionality is restricted"**
   - Provide test credentials:
     ```
     Email: test@movever.com
     Password: Test123!
     ```
3. Save

## Step 12: Upload Your AAB

1. Go to **"Production"** → **"Create new release"**
2. Click **"Upload"**
3. Select the AAB file you downloaded from EAS
4. Fill in **"Release notes"**:
   ```
   Initial release of Movever
   - Connect travelers with businesses
   - Secure payment system
   - Identity verification
   - Real-time tracking
   ```
5. Click **"Save"** then **"Review release"**

## Step 13: Set Up Pricing & Distribution

1. Go to **"Pricing & distribution"**
2. Select **countries** where you want to distribute
3. Check **"Free"**
4. Accept content guidelines
5. Save

## Step 14: Submit for Review

1. Go back to **"Production"** release
2. Click **"Send for review"**
3. Google will review your app (usually 1-7 days)

---

## 🔧 Troubleshooting

### Build Failed?
```powershell
# Clear cache and try again
eas build:configure
eas build --platform android --profile production --clear-cache
```

### Need to Update App?
1. Update `version` in `app.json` (e.g., "1.0.1")
2. Increment `versionCode` in `app.json` (e.g., 2)
3. Build again:
   ```powershell
   eas build --platform android --profile production
   ```
4. Upload new AAB to Play Console

### App Rejected?
- Check email from Google Play
- Fix issues mentioned
- Resubmit

---

## 📱 After Approval

Once approved:
1. Your app will be live on Play Store!
2. Share the link: `https://play.google.com/store/apps/details?id=com.movever.app`
3. Monitor reviews and ratings
4. Update regularly

---

## 🎯 Quick Commands Reference

```powershell
# Login to Expo
eas login

# Build test APK
eas build --platform android --profile preview

# Build production AAB
eas build --platform android --profile production

# Check build status
eas build:list

# Submit to Play Store (after setup)
eas submit --platform android
```

---

## ⚠️ Important Notes

1. **First review takes longest** (1-7 days)
2. **Updates are faster** (usually 1-2 days)
3. **Keep your signing key safe** - EAS manages this automatically
4. **Test thoroughly** before submitting
5. **Respond to user reviews** to maintain good ratings

---

## 🎉 You're Ready!

Follow these steps carefully and your app will be on the Play Store soon!

**Need help?** Check the errors and let me know what step you're stuck on.
