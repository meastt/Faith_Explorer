import UIKit
import Capacitor
import TikTokBusinessSDK
import AppTrackingTransparency

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    // TikTok Configuration from Events Manager
    // App ID: Used for SDK initialization
    private let appID = "6753657912"
    // TikTok App ID: Used for event tracking and attribution
    private let tikTokAppID = "7586720881788928018"

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize TikTok SDK
        initializeTikTokSDK()

        return true
    }

    // MARK: UISceneSession Lifecycle

    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
    }

    private func initializeTikTokSDK() {
        // Configure TikTok SDK with both App ID and TikTok App ID
        let config = TikTokConfig(appId: appID, tiktokAppId: tikTokAppID)

        // Initialize the SDK
        if let config = config {
            TikTokBusiness.initializeSdk(config)
        }

        // Request App Tracking Transparency authorization after a short delay
        // to ensure the app has fully launched
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.requestTrackingAuthorization()
        }
    }

    private func requestTrackingAuthorization() {
        if #available(iOS 14, *) {
            ATTrackingManager.requestTrackingAuthorization { status in
                switch status {
                case .authorized:
                    print("TikTok: Tracking authorized")
                case .denied:
                    print("TikTok: Tracking denied")
                case .notDetermined:
                    print("TikTok: Tracking not determined")
                case .restricted:
                    print("TikTok: Tracking restricted")
                @unknown default:
                    print("TikTok: Unknown tracking status")
                }
            }
        }
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
