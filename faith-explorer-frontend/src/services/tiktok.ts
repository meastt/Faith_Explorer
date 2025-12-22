import { registerPlugin } from '@capacitor/core';
import { Capacitor } from '@capacitor/core';

/**
 * TikTok Ads SDK Plugin for Capacitor
 * 
 * This service provides methods to track events for TikTok Ads attribution
 * and optimization. Events tracked here will appear in TikTok Events Manager.
 * 
 * App ID: 6753657912
 * TikTok App ID: 7586720881788928018
 */

interface TikTokPlugin {
  trackEvent(options: { eventName: string; properties?: Record<string, unknown> }): Promise<{ success: boolean }>;
  trackPurchase(options: { 
    contentType?: string; 
    contentId?: string; 
    currency?: string; 
    value?: number 
  }): Promise<{ success: boolean }>;
  trackSubscription(options: { 
    subscriptionId?: string; 
    currency?: string; 
    value?: number; 
    subscriptionPeriod?: string 
  }): Promise<{ success: boolean }>;
  trackContentView(options: { 
    contentType?: string; 
    contentId?: string; 
    contentName?: string 
  }): Promise<{ success: boolean }>;
  trackSearch(options: { query: string }): Promise<{ success: boolean }>;
  identify(options: { 
    externalId?: string; 
    email?: string; 
    phoneNumber?: string 
  }): Promise<{ success: boolean }>;
}

const TikTok = registerPlugin<TikTokPlugin>('TikTok');

/**
 * Check if we're running on a native iOS platform
 */
const isNative = (): boolean => {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
};

/**
 * TikTok Analytics Service
 * 
 * Provides easy-to-use methods for tracking TikTok events.
 * All methods are safe to call on any platform - they will
 * no-op on web/non-iOS platforms.
 */
export const TikTokAnalytics = {
  /**
   * Track a custom event
   * @param eventName - The name of the event (e.g., 'CompleteRegistration', 'AddToCart')
   * @param properties - Optional additional properties
   */
  async trackEvent(eventName: string, properties?: Record<string, unknown>): Promise<void> {
    if (!isNative()) {
      console.log(`[TikTok Dev] Event: ${eventName}`, properties);
      return;
    }
    
    try {
      await TikTok.trackEvent({ eventName, properties });
    } catch (error) {
      console.error('[TikTok] Failed to track event:', error);
    }
  },

  /**
   * Track a purchase event
   * @param value - The purchase value
   * @param currency - Currency code (default: 'USD')
   * @param contentId - ID of the purchased content
   * @param contentType - Type of content (default: 'product')
   */
  async trackPurchase(
    value: number,
    currency: string = 'USD',
    contentId?: string,
    contentType: string = 'product'
  ): Promise<void> {
    if (!isNative()) {
      console.log(`[TikTok Dev] Purchase: $${value} ${currency}`, { contentId, contentType });
      return;
    }
    
    try {
      await TikTok.trackPurchase({ 
        value, 
        currency, 
        contentId, 
        contentType 
      });
    } catch (error) {
      console.error('[TikTok] Failed to track purchase:', error);
    }
  },

  /**
   * Track a subscription event
   * @param subscriptionId - The subscription product ID
   * @param value - The subscription value
   * @param currency - Currency code (default: 'USD')
   * @param period - Subscription period ('weekly', 'monthly', 'yearly')
   */
  async trackSubscription(
    subscriptionId: string,
    value: number,
    currency: string = 'USD',
    period: 'weekly' | 'monthly' | 'yearly' = 'monthly'
  ): Promise<void> {
    if (!isNative()) {
      console.log(`[TikTok Dev] Subscription: ${subscriptionId} - $${value} ${currency} (${period})`);
      return;
    }
    
    try {
      await TikTok.trackSubscription({ 
        subscriptionId, 
        value, 
        currency, 
        subscriptionPeriod: period 
      });
    } catch (error) {
      console.error('[TikTok] Failed to track subscription:', error);
    }
  },

  /**
   * Track content view event
   * @param contentName - Name of the content being viewed
   * @param contentId - ID of the content
   * @param contentType - Type of content (e.g., 'article', 'verse', 'scripture')
   */
  async trackContentView(
    contentName: string,
    contentId?: string,
    contentType: string = 'article'
  ): Promise<void> {
    if (!isNative()) {
      console.log(`[TikTok Dev] Content View: ${contentName}`, { contentId, contentType });
      return;
    }
    
    try {
      await TikTok.trackContentView({ 
        contentName, 
        contentId, 
        contentType 
      });
    } catch (error) {
      console.error('[TikTok] Failed to track content view:', error);
    }
  },

  /**
   * Track search event
   * @param query - The search query string
   */
  async trackSearch(query: string): Promise<void> {
    if (!isNative()) {
      console.log(`[TikTok Dev] Search: "${query}"`);
      return;
    }
    
    try {
      await TikTok.trackSearch({ query });
    } catch (error) {
      console.error('[TikTok] Failed to track search:', error);
    }
  },

  /**
   * Identify user for better attribution matching
   * @param options - User identification options
   */
  async identify(options: { 
    externalId?: string; 
    email?: string; 
    phoneNumber?: string 
  }): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] Identify:', options);
      return;
    }
    
    try {
      await TikTok.identify(options);
    } catch (error) {
      console.error('[TikTok] Failed to identify user:', error);
    }
  },

  /**
   * Track app launch (called automatically by SDK, but can be called manually)
   */
  async trackAppLaunch(): Promise<void> {
    await this.trackEvent('LaunchAPP');
  },

  /**
   * Track registration complete
   */
  async trackRegistration(): Promise<void> {
    await this.trackEvent('CompleteRegistration');
  },

  /**
   * Track when user adds payment info
   */
  async trackAddPaymentInfo(): Promise<void> {
    await this.trackEvent('AddPaymentInfo');
  },

  /**
   * Track when user starts checkout
   */
  async trackInitiateCheckout(): Promise<void> {
    await this.trackEvent('InitiateCheckout');
  },

  /**
   * Track verse or scripture view (Faith Explorer specific)
   * @param religion - The religion name
   * @param book - The book/source name  
   * @param reference - The verse reference
   */
  async trackVerseView(religion: string, book: string, reference: string): Promise<void> {
    await this.trackContentView(
      `${book} - ${reference}`,
      `${religion}:${book}:${reference}`,
      'scripture'
    );
  },

  /**
   * Track AI conversation (Faith Explorer specific)
   * @param topic - The conversation topic
   */
  async trackAIConversation(topic: string): Promise<void> {
    await this.trackEvent('AIConversation', { topic });
  }
};

export default TikTokAnalytics;
