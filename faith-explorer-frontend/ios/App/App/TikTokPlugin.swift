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
        CAPPluginMethod(name: "identify", returnType: CAPPluginReturnPromise)
    ]
    
    /// Track a custom event
    @objc func trackEvent(_ call: CAPPluginCall) {
        guard let eventName = call.getString("eventName") else {
            call.reject("Event name is required")
            return
        }
        
        let properties = call.getObject("properties") ?? [:]
        
        TikTokBusiness.trackEvent(eventName, withProperties: properties as [AnyHashable: Any])
        
        call.resolve(["success": true])
    }
    
    /// Track a purchase/subscription event
    @objc func trackPurchase(_ call: CAPPluginCall) {
        let contentType = call.getString("contentType") ?? "product"
        let contentId = call.getString("contentId") ?? ""
        let currency = call.getString("currency") ?? "USD"
        let value = call.getDouble("value") ?? 0.0
        
        let properties: [String: Any] = [
            "content_type": contentType,
            "content_id": contentId,
            "currency": currency,
            "value": value
        ]
        
        TikTokBusiness.trackEvent("Purchase", withProperties: properties)
        
        call.resolve(["success": true])
    }
    
    /// Track a subscription event (specific for in-app subscriptions)
    @objc func trackSubscription(_ call: CAPPluginCall) {
        let subscriptionId = call.getString("subscriptionId") ?? ""
        let currency = call.getString("currency") ?? "USD"
        let value = call.getDouble("value") ?? 0.0
        let subscriptionPeriod = call.getString("subscriptionPeriod") ?? "monthly"
        
        let properties: [String: Any] = [
            "content_type": "subscription",
            "content_id": subscriptionId,
            "currency": currency,
            "value": value,
            "subscription_period": subscriptionPeriod
        ]
        
        TikTokBusiness.trackEvent("Subscribe", withProperties: properties)
        
        call.resolve(["success": true])
    }
    
    /// Track content view event
    @objc func trackContentView(_ call: CAPPluginCall) {
        let contentType = call.getString("contentType") ?? "article"
        let contentId = call.getString("contentId") ?? ""
        let contentName = call.getString("contentName") ?? ""
        
        let properties: [String: Any] = [
            "content_type": contentType,
            "content_id": contentId,
            "content_name": contentName
        ]
        
        TikTokBusiness.trackEvent("ViewContent", withProperties: properties)
        
        call.resolve(["success": true])
    }
    
    /// Track search event
    @objc func trackSearch(_ call: CAPPluginCall) {
        let query = call.getString("query") ?? ""
        
        let properties: [String: Any] = [
            "search_string": query
        ]
        
        TikTokBusiness.trackEvent("Search", withProperties: properties)
        
        call.resolve(["success": true])
    }
    
    /// Identify user (for better attribution)
    @objc func identify(_ call: CAPPluginCall) {
        let externalId = call.getString("externalId")
        let email = call.getString("email")
        let phoneNumber = call.getString("phoneNumber")
        
        // TikTok SDK handles user identification automatically,
        // but you can pass additional user properties for better matching
        var properties: [String: Any] = [:]
        
        if let externalId = externalId {
            properties["external_id"] = externalId
        }
        if let email = email {
            properties["email"] = email
        }
        if let phoneNumber = phoneNumber {
            properties["phone_number"] = phoneNumber
        }
        
        if !properties.isEmpty {
            TikTokBusiness.trackEvent("Identify", withProperties: properties)
        }
        
        call.resolve(["success": true])
    }
}
