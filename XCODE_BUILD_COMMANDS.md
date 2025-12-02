# Commands to Run Before Building in Xcode

## Quick Build Commands

From the `faith-explorer-frontend` directory, run:

```bash
# 1. Build the web assets
npm run build

# 2. Sync to iOS project (copies dist/ to iOS and updates config)
npx cap sync ios
```

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


