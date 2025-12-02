/**
 * Push Notification Service
 * Handles registration and management of push notifications for re-engagement
 */

import { Capacitor } from '@capacitor/core';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
}

class NotificationService {
  private isSupported: boolean = false;
  private token: string | null = null;

  constructor() {
    this.isSupported = Capacitor.isNativePlatform();
  }

  /**
   * Check if push notifications are supported on this platform
   */
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Request permission for push notifications
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return { granted: false, denied: true };
    }

    try {
      // For web, use browser Notification API
      if ('Notification' in window && !Capacitor.isNativePlatform()) {
        const permission = await Notification.requestPermission();
        return {
          granted: permission === 'granted',
          denied: permission === 'denied',
        };
      }

      // For native platforms, would integrate with Capacitor Push Notifications
      // This is a placeholder for future native implementation
      console.log('Native push notifications will be implemented with @capacitor/push-notifications');
      return { granted: false, denied: false };
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return { granted: false, denied: true };
    }
  }

  /**
   * Register device for push notifications
   */
  async register(): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    try {
      const permission = await this.requestPermission();
      if (!permission.granted) {
        return false;
      }

      // TODO: Integrate with backend to store device token
      // For now, just log that registration would happen
      console.log('Device registered for push notifications');
      return true;
    } catch (error) {
      console.error('Failed to register for notifications:', error);
      return false;
    }
  }

  /**
   * Schedule a local notification (for re-engagement)
   */
  async scheduleLocal(options: {
    title: string;
    body: string;
    scheduleAt: Date;
  }): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    try {
      // TODO: Integrate with @capacitor/local-notifications
      console.log('Local notification scheduled:', options);
      return true;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return false;
    }
  }

  /**
   * Schedule re-engagement notification for users who haven't used the app
   */
  async scheduleReEngagement(daysInactive: number = 7): Promise<void> {
    const scheduleAt = new Date();
    scheduleAt.setDate(scheduleAt.getDate() + daysInactive);

    const wisdomTopics = [
      'the meaning of life',
      'finding inner peace',
      'compassion and love',
      'overcoming suffering',
      'gratitude and thankfulness',
    ];
    const randomTopic = wisdomTopics[Math.floor(Math.random() * wisdomTopics.length)];

    await this.scheduleLocal({
      title: 'Discover Wisdom Today',
      body: `Explore what sacred texts say about ${randomTopic}`,
      scheduleAt,
    });
  }

  /**
   * Unregister from push notifications
   */
  async unregister(): Promise<boolean> {
    try {
      this.token = null;
      // TODO: Notify backend to remove device token
      console.log('Device unregistered from push notifications');
      return true;
    } catch (error) {
      console.error('Failed to unregister:', error);
      return false;
    }
  }

  /**
   * Check current notification permission status
   */
  async getPermissionStatus(): Promise<NotificationPermission> {
    if ('Notification' in window && !Capacitor.isNativePlatform()) {
      return {
        granted: Notification.permission === 'granted',
        denied: Notification.permission === 'denied',
      };
    }
    return { granted: false, denied: false };
  }
}

export const notificationService = new NotificationService();
