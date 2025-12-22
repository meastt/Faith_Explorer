import Foundation
import Capacitor
import TikTokBusinessSDK

@objc(TikTokPlugin)
public class TikTokPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "TikTokPlugin"
    public let jsName = "TikTok"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "trackEvent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackPurchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackSubscription", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackContentView", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackSearch", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackCheckout", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackAddToCart", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackAddToWishlist", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackStartTrial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackRegistration", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackLogin", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackCompleteTutorial", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackAchieveLevel", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackUnlockAchievement", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackSpendCredits", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackRate", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackAddPaymentInfo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "identify", returnType: CAPPluginReturnPromise)
    ]
    
    // MARK: - Identify User
    
    /// Identify user for better attribution matching
    @objc func identify(_ call: CAPPluginCall) {
        let externalId = call.getString("externalId") ?? ""
        let externalUserName = call.getString("externalUserName") ?? ""
        let email = call.getString("email") ?? ""
        let phoneNumber = call.getString("phoneNumber") ?? ""
        
        TikTokBusiness.identify(
            withExternalID: externalId,
            externalUserName: externalUserName,
            phoneNumber: phoneNumber,
            email: email
        )
        
        call.resolve(["success": true])
    }
    
    // MARK: - Base Events
    
    /// Track a standard TikTok event by name
    @objc func trackEvent(_ call: CAPPluginCall) {
        guard let eventName = call.getString("eventName") else {
            call.reject("Event name is required")
            return
        }
        
        // Map common event names to TikTok event constants
        let ttEventName = mapEventName(eventName)
        
        if let event = TikTokBaseEvent(eventName: ttEventName) {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Search event
    @objc func trackSearch(_ call: CAPPluginCall) {
        let query = call.getString("query") ?? ""
        
        if let event = TikTokBaseEvent(eventName: "Search") {
            // Add search query as custom property if needed
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Subscribe event
    @objc func trackSubscription(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "Subscribe") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Registration event
    @objc func trackRegistration(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "Registration") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Login event
    @objc func trackLogin(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "Login") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Start Trial event
    @objc func trackStartTrial(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "StartTrial") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Complete Tutorial event
    @objc func trackCompleteTutorial(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "CompleteTutorial") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Achieve Level event
    @objc func trackAchieveLevel(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "AchieveLevel") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Unlock Achievement event
    @objc func trackUnlockAchievement(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "UnlockAchievement") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Spend Credits event
    @objc func trackSpendCredits(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "SpendCredits") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Rate event
    @objc func trackRate(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "Rate") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    /// Track Add Payment Info event
    @objc func trackAddPaymentInfo(_ call: CAPPluginCall) {
        if let event = TikTokBaseEvent(eventName: "AddPaymentInfo") {
            TikTokBusiness.trackTTEvent(event)
        }
        
        call.resolve(["success": true])
    }
    
    // MARK: - Content Events (with product details)
    
    /// Track Purchase event with content details
    @objc func trackPurchase(_ call: CAPPluginCall) {
        let event = TikTokPurchaseEvent()
        
        configureContentsEvent(event, from: call)
        
        TikTokBusiness.trackTTEvent(event)
        
        call.resolve(["success": true])
    }
    
    /// Track View Content event
    @objc func trackContentView(_ call: CAPPluginCall) {
        let event = TikTokViewContentEvent()
        
        configureContentsEvent(event, from: call)
        
        TikTokBusiness.trackTTEvent(event)
        
        call.resolve(["success": true])
    }
    
    /// Track Checkout event
    @objc func trackCheckout(_ call: CAPPluginCall) {
        let event = TikTokCheckoutEvent()
        
        configureContentsEvent(event, from: call)
        
        TikTokBusiness.trackTTEvent(event)
        
        call.resolve(["success": true])
    }
    
    /// Track Add to Cart event
    @objc func trackAddToCart(_ call: CAPPluginCall) {
        let event = TikTokAddToCartEvent()
        
        configureContentsEvent(event, from: call)
        
        TikTokBusiness.trackTTEvent(event)
        
        call.resolve(["success": true])
    }
    
    /// Track Add to Wishlist event
    @objc func trackAddToWishlist(_ call: CAPPluginCall) {
        let event = TikTokAddToWishlistEvent()
        
        configureContentsEvent(event, from: call)
        
        TikTokBusiness.trackTTEvent(event)
        
        call.resolve(["success": true])
    }
    
    // MARK: - Helper Methods
    
    /// Configure a TikTokContentsEvent with parameters from the plugin call
    private func configureContentsEvent(_ event: TikTokContentsEvent, from call: CAPPluginCall) {
        // Set basic event properties
        if let contentId = call.getString("contentId") {
            event.setContentId(contentId)
        }
        
        if let contentType = call.getString("contentType") {
            event.setContentType(contentType)
        }
        
        if let description = call.getString("description") {
            event.setDescription(description)
        }
        
        // Set currency
        let currency = call.getString("currency") ?? "USD"
        event.setCurrency(mapCurrency(currency))
        
        // Set value
        if let value = call.getDouble("value") {
            event.setValue(String(format: "%.2f", value))
        }
        
        // Create content params if we have price info
        let price = call.getDouble("price") ?? call.getDouble("value") ?? 0.0
        let quantity = call.getInt("quantity") ?? 1
        let contentName = call.getString("contentName") ?? ""
        let brand = call.getString("brand") ?? "Faith Explorer"
        
        let eventContent = TikTokContentParams()
        eventContent.price = NSNumber(value: price)
        eventContent.quantity = quantity
        eventContent.brand = brand
        eventContent.contentName = contentName
        
        event.setContents([eventContent])
    }
    
    /// Map currency string to TikTok currency enum
    private func mapCurrency(_ currency: String) -> TTCurrency {
        switch currency.uppercased() {
        case "USD": return .USD
        case "EUR": return .EUR
        case "GBP": return .GBP
        case "CAD": return .CAD
        case "AUD": return .AUD
        case "JPY": return .JPY
        case "CNY": return .CNY
        case "INR": return .INR
        case "BRL": return .BRL
        case "MXN": return .MXN
        default: return .USD
        }
    }
    
    /// Map event name string to TikTok event name constant
    private func mapEventName(_ name: String) -> String {
        // Return the name as-is since TikTok SDK accepts string event names
        // The SDK will map common names internally
        return name
    }
}
