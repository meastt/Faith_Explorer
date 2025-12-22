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

interface ContentEventOptions {
  contentId?: string;
  contentType?: string;
  contentName?: string;
  description?: string;
  currency?: string;
  value?: number;
  price?: number;
  quantity?: number;
  brand?: string;
}

interface TikTokPlugin {
  // Base events
  trackEvent(options: { eventName: string }): Promise<{ success: boolean }>;
  trackSearch(options: { query: string }): Promise<{ success: boolean }>;
  trackSubscription(options: Record<string, never>): Promise<{ success: boolean }>;
  trackRegistration(options: Record<string, never>): Promise<{ success: boolean }>;
  trackLogin(options: Record<string, never>): Promise<{ success: boolean }>;
  trackStartTrial(options: Record<string, never>): Promise<{ success: boolean }>;
  trackCompleteTutorial(options: Record<string, never>): Promise<{ success: boolean }>;
  trackAchieveLevel(options: Record<string, never>): Promise<{ success: boolean }>;
  trackUnlockAchievement(options: Record<string, never>): Promise<{ success: boolean }>;
  trackSpendCredits(options: Record<string, never>): Promise<{ success: boolean }>;
  trackRate(options: Record<string, never>): Promise<{ success: boolean }>;
  trackAddPaymentInfo(options: Record<string, never>): Promise<{ success: boolean }>;
  
  // Content events (with product details)
  trackPurchase(options: ContentEventOptions): Promise<{ success: boolean }>;
  trackContentView(options: ContentEventOptions): Promise<{ success: boolean }>;
  trackCheckout(options: ContentEventOptions): Promise<{ success: boolean }>;
  trackAddToCart(options: ContentEventOptions): Promise<{ success: boolean }>;
  trackAddToWishlist(options: ContentEventOptions): Promise<{ success: boolean }>;
  
  // User identification
  identify(options: { 
    externalId?: string;
    externalUserName?: string;
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
  // ==========================================
  // USER IDENTIFICATION
  // ==========================================
  
  /**
   * Identify user for better attribution matching
   * Call this when user logs in to improve ad attribution
   */
  async identify(options: { 
    externalId?: string;
    externalUserName?: string;
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

  // ==========================================
  // BASE EVENTS (Standard TikTok Events)
  // ==========================================
  
  /**
   * Track a custom event by name
   */
  async trackEvent(eventName: string): Promise<void> {
    if (!isNative()) {
      console.log(`[TikTok Dev] Event: ${eventName}`);
      return;
    }
    
    try {
      await TikTok.trackEvent({ eventName });
    } catch (error) {
      console.error('[TikTok] Failed to track event:', error);
    }
  },

  /**
   * Track search event
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
   * Track subscription event (when user subscribes)
   */
  async trackSubscription(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] Subscribe');
      return;
    }
    
    try {
      await TikTok.trackSubscription({});
    } catch (error) {
      console.error('[TikTok] Failed to track subscription:', error);
    }
  },

  /**
   * Track user registration
   */
  async trackRegistration(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] Registration');
      return;
    }
    
    try {
      await TikTok.trackRegistration({});
    } catch (error) {
      console.error('[TikTok] Failed to track registration:', error);
    }
  },

  /**
   * Track user login
   */
  async trackLogin(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] Login');
      return;
    }
    
    try {
      await TikTok.trackLogin({});
    } catch (error) {
      console.error('[TikTok] Failed to track login:', error);
    }
  },

  /**
   * Track when user starts a free trial
   */
  async trackStartTrial(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] StartTrial');
      return;
    }
    
    try {
      await TikTok.trackStartTrial({});
    } catch (error) {
      console.error('[TikTok] Failed to track start trial:', error);
    }
  },

  /**
   * Track when user completes onboarding/tutorial
   */
  async trackCompleteTutorial(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] CompleteTutorial');
      return;
    }
    
    try {
      await TikTok.trackCompleteTutorial({});
    } catch (error) {
      console.error('[TikTok] Failed to track complete tutorial:', error);
    }
  },

  /**
   * Track when user achieves a level
   */
  async trackAchieveLevel(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] AchieveLevel');
      return;
    }
    
    try {
      await TikTok.trackAchieveLevel({});
    } catch (error) {
      console.error('[TikTok] Failed to track achieve level:', error);
    }
  },

  /**
   * Track when user unlocks an achievement
   */
  async trackUnlockAchievement(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] UnlockAchievement');
      return;
    }
    
    try {
      await TikTok.trackUnlockAchievement({});
    } catch (error) {
      console.error('[TikTok] Failed to track unlock achievement:', error);
    }
  },

  /**
   * Track when user spends credits/coins
   */
  async trackSpendCredits(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] SpendCredits');
      return;
    }
    
    try {
      await TikTok.trackSpendCredits({});
    } catch (error) {
      console.error('[TikTok] Failed to track spend credits:', error);
    }
  },

  /**
   * Track when user rates something
   */
  async trackRate(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] Rate');
      return;
    }
    
    try {
      await TikTok.trackRate({});
    } catch (error) {
      console.error('[TikTok] Failed to track rate:', error);
    }
  },

  /**
   * Track when user adds payment info
   */
  async trackAddPaymentInfo(): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] AddPaymentInfo');
      return;
    }
    
    try {
      await TikTok.trackAddPaymentInfo({});
    } catch (error) {
      console.error('[TikTok] Failed to track add payment info:', error);
    }
  },

  // ==========================================
  // CONTENT EVENTS (with product/content details)
  // ==========================================

  /**
   * Track a purchase event with content details
   */
  async trackPurchase(options: {
    contentId?: string;
    contentType?: string;
    contentName?: string;
    description?: string;
    currency?: string;
    value: number;
    quantity?: number;
  }): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] Purchase:', options);
      return;
    }
    
    try {
      await TikTok.trackPurchase({
        ...options,
        price: options.value,
        brand: 'Faith Explorer'
      });
    } catch (error) {
      console.error('[TikTok] Failed to track purchase:', error);
    }
  },

  /**
   * Track content view event
   */
  async trackContentView(options: {
    contentId?: string;
    contentType?: string;
    contentName: string;
    description?: string;
  }): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] ViewContent:', options);
      return;
    }
    
    try {
      await TikTok.trackContentView({
        ...options,
        brand: 'Faith Explorer'
      });
    } catch (error) {
      console.error('[TikTok] Failed to track content view:', error);
    }
  },

  /**
   * Track checkout event
   */
  async trackCheckout(options: {
    contentId?: string;
    contentType?: string;
    contentName?: string;
    currency?: string;
    value: number;
  }): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] Checkout:', options);
      return;
    }
    
    try {
      await TikTok.trackCheckout({
        ...options,
        price: options.value,
        brand: 'Faith Explorer'
      });
    } catch (error) {
      console.error('[TikTok] Failed to track checkout:', error);
    }
  },

  /**
   * Track add to cart event
   */
  async trackAddToCart(options: {
    contentId?: string;
    contentType?: string;
    contentName?: string;
    currency?: string;
    value?: number;
  }): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] AddToCart:', options);
      return;
    }
    
    try {
      await TikTok.trackAddToCart({
        ...options,
        brand: 'Faith Explorer'
      });
    } catch (error) {
      console.error('[TikTok] Failed to track add to cart:', error);
    }
  },

  /**
   * Track add to wishlist event (e.g., saving a verse)
   */
  async trackAddToWishlist(options: {
    contentId?: string;
    contentType?: string;
    contentName?: string;
  }): Promise<void> {
    if (!isNative()) {
      console.log('[TikTok Dev] AddToWishlist:', options);
      return;
    }
    
    try {
      await TikTok.trackAddToWishlist({
        ...options,
        brand: 'Faith Explorer'
      });
    } catch (error) {
      console.error('[TikTok] Failed to track add to wishlist:', error);
    }
  },

  // ==========================================
  // FAITH EXPLORER SPECIFIC HELPERS
  // ==========================================

  /**
   * Track verse or scripture view
   */
  async trackVerseView(religion: string, book: string, reference: string): Promise<void> {
    await this.trackContentView({
      contentId: `${religion}:${book}:${reference}`,
      contentType: 'scripture',
      contentName: `${book} ${reference}`,
      description: `Viewing ${religion} scripture: ${book} ${reference}`
    });
  },

  /**
   * Track when user saves a verse (like add to wishlist)
   */
  async trackSaveVerse(religion: string, book: string, reference: string): Promise<void> {
    await this.trackAddToWishlist({
      contentId: `${religion}:${book}:${reference}`,
      contentType: 'scripture',
      contentName: `${book} ${reference}`
    });
  },

  /**
   * Track AI conversation/question
   */
  async trackAIQuestion(topic: string): Promise<void> {
    await this.trackSearch(topic);
  },

  /**
   * Track subscription purchase with details
   */
  async trackSubscriptionPurchase(options: {
    productId: string;
    price: number;
    currency?: string;
    period: 'weekly' | 'monthly' | 'yearly';
  }): Promise<void> {
    // Track both the purchase event and subscribe event
    await this.trackPurchase({
      contentId: options.productId,
      contentType: 'subscription',
      contentName: `${options.period} subscription`,
      description: `Faith Explorer ${options.period} subscription`,
      currency: options.currency || 'USD',
      value: options.price
    });
    
    // Also track the subscribe event
    await this.trackSubscription();
  },

  /**
   * Track when user completes onboarding
   */
  async trackOnboardingComplete(): Promise<void> {
    await this.trackCompleteTutorial();
  },

  /**
   * Track app launch
   */
  async trackAppLaunch(): Promise<void> {
    await this.trackEvent('LaunchAPP');
  }
};

export default TikTokAnalytics;
