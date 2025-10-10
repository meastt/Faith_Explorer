# App Store Subscription Fix - Guideline 3.1.2

## Issue
App Store rejected build due to missing subscription information for auto-renewable subscriptions.

## ✅ Fixed in Code (SubscriptionModal.tsx)
The app binary now displays all required information:
- ✅ Title: "Faith Explorer Pro Auto-Renewable Subscription"
- ✅ Length: "Monthly (1 month) or Annual (12 months)"
- ✅ Price: Dynamic pricing with per-unit cost
- ✅ Privacy Policy link: https://faithexplorer.app/privacy
- ✅ Terms of Use (EULA) link: https://faithexplorer.app/terms/
- ✅ Subscription renewal and cancellation terms

## 📝 TO DO: App Store Connect Metadata

### Step 1: Update App Description
1. Log into [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app → **App Information**
3. Edit the **App Description** field
4. Add this text at the end of your description:

```
---
Terms of Use (EULA): https://faithexplorer.app/terms/
Privacy Policy: https://faithexplorer.app/privacy

Faith Explorer Pro is an auto-renewable subscription that gives you unlimited access to all features. Subscriptions are available as Monthly or Annual plans. Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless canceled at least 24 hours before the end of the current period. Manage your subscription in your App Store account settings.
```

### Step 2: Verify Privacy Policy URL
1. In App Store Connect, go to **App Privacy** section
2. Confirm the **Privacy Policy URL** field contains: `https://faithexplorer.app/privacy`
3. Save changes

### Step 3: Build and Submit New Version
1. ✅ Build number incremented from 10 to 11 in project.pbxproj
2. Sync Capacitor changes to iOS: `npx cap sync ios`
3. Open Xcode and build/archive the app
4. Upload to App Store Connect
5. Submit for review with the following note:

```
Reviewer Note:
We have addressed the subscription information requirements per Guideline 3.1.2:

1. The app binary now displays all required subscription information including:
   - Subscription title: "Faith Explorer Pro Auto-Renewable Subscription"
   - Subscription length: Monthly (1 month) or Annual (12 months)
   - Pricing information with per-unit costs
   - Functional links to Privacy Policy and Terms of Use (EULA)
   - Auto-renewal and cancellation terms

2. App metadata has been updated to include the Terms of Use link in the App Description.

3. Privacy Policy URL is properly configured in the App Privacy section.

All subscription information is now clearly displayed to users before purchase as required.
```

## 🔗 Important Links
- **Privacy Policy**: https://faithexplorer.app/privacy
- **Terms of Use**: https://faithexplorer.app/terms/

## 📋 Apple's Requirements Checklist
- ✅ Title of auto-renewing subscription in binary
- ✅ Length of subscription in binary
- ✅ Price of subscription in binary
- ✅ Functional Privacy Policy link in binary
- ✅ Functional Terms of Use link in binary
- ⏳ Privacy Policy URL in App Store Connect metadata
- ⏳ Terms of Use link in App Description OR Custom EULA in App Store Connect

## Reference
- **Apple Guideline**: 3.1.2 - Business - Payments - Subscriptions
- **Apple Documentation**: [In-App Purchase](https://developer.apple.com/in-app-purchase/)
- **License Agreement**: Schedule 2 of the Apple Developer Program License Agreement

