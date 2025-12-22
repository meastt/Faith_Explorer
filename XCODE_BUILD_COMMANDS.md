# Commands to Run Before Building in Xcode

## Quick Build Commands

From the `faith-explorer-frontend` directory, run:

```bash
# 1. Build the web assets
npm run build

# 2. Sync to iOS project (copies dist/ to iOS and updates config)
npx cap sync ios
```

## TikTok Ads SDK Setup (First Time Only)

The TikTok Business SDK has been integrated for ad attribution and event tracking. After syncing, you need to install the pod:

```bash
cd faith-explorer-frontend/ios/App
pod install
```

**TikTok Configuration:**
- **App ID:** `6753657912`
- **TikTok App ID:** `7586720881788928018`
- **App Name:** Faith Explorer – Scripture AI
- **App Secret:** `TTbHgfzGthXQJU8qJzXMfkf7FAAIG44b` *(keep secure - for server-side API only)*
- The SDK is initialized automatically in `AppDelegate.swift`
- App Tracking Transparency (ATT) prompt is configured in `Info.plist`

**Linker Flags (already configured):**
- `-ObjC` and `-lc++` have been added to "Other Linker Flags" in build settings

## Full Workflow for App Store Submission

```bash
# Navigate to frontend directory
cd faith-explorer-frontend

# Build the React/Vite app
npm run build

# Sync to iOS (this copies dist/ to ios/App/App/public)
npx cap sync ios

# Then open Xcode
open ios/App/App.xcworkspace
```

## What Each Command Does

1. **`npm run build`**
   - Runs TypeScript compiler (`tsc -b`)
   - Builds production bundle with Vite
   - Outputs to `dist/` directory

2. **`npx cap sync ios`**
   - Copies `dist/` → `ios/App/App/public/`
   - Updates `capacitor.config.json` in iOS project
   - Updates iOS native dependencies (runs pod install)

## After Running These Commands

1. Open Xcode: `open ios/App/App.xcworkspace`
2. Select "Any iOS Device (arm64)" as target
3. Product → Archive
4. Upload to App Store Connect

## One-Liner (if you're in the root directory)

```bash
cd faith-explorer-frontend && npm run build && npx cap sync ios && open ios/App/App.xcworkspace
```



