/**
 * Push Notification Service
 * Handles registration and management of push notifications for re-engagement
 */

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
}

class NotificationService {
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = Capacitor.isNativePlatform();
    this.initializeListeners();
  }

  private initializeListeners() {
    if (!this.isSupported) return;

    // Listen for registration success
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token: ' + token.value);
      // TODO: Send token to backend
    });

    // Listen for registration error
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Error on push registration: ' + JSON.stringify(error));
    });

    // Listen for notification received
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received: ' + JSON.stringify(notification));
    });

    // Listen for notification action
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
    });
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
      // Fallback for web testing
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        return {
          granted: permission === 'granted',
          denied: permission === 'denied',
        };
      }
      return { granted: false, denied: true };
    }

    try {
      // Request permissions for both Push and Local notifications
      const pushStatus = await PushNotifications.requestPermissions();
      const localStatus = await LocalNotifications.requestPermissions();

      const granted = pushStatus.receive === 'granted' && localStatus.display === 'granted';

      if (granted) {
        // Register with Apple/FCM if permission granted
        await PushNotifications.register();
      }

      return {
        granted,
        denied: !granted,
      };
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
    id?: number;
  }): Promise<boolean> {
    if (!this.isSupported) {
      console.log('Local notifications not supported on web, would schedule:', options);
      return false;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: options.title,
            body: options.body,
            id: options.id || Math.floor(Math.random() * 100000),
            schedule: { at: options.scheduleAt },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null,
          },
        ],
      });
      console.log('Local notification scheduled:', options);
      return true;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return false;
    }
  }

  /**
   * Schedule re-engagement notification for users who haven't used the app
   * This should be called whenever the app is opened to reset the timer
   */
  async scheduleReEngagement(daysInactive: number = 3): Promise<void> {
    const scheduleAt = new Date();
    scheduleAt.setDate(scheduleAt.getDate() + daysInactive);
    // Set to a reasonable time, e.g., 9:00 AM
    scheduleAt.setHours(9, 0, 0, 0);

    // If the scheduled time is in the past (e.g. it's 10 AM now), add another day
    if (scheduleAt.getTime() < Date.now()) {
      scheduleAt.setDate(scheduleAt.getDate() + 1);
    }

    const wisdomTopics = [
      'the meaning of life',
      'finding inner peace',
      'compassion and love',
      'overcoming suffering',
      'gratitude and thankfulness',
      'forgiveness',
      'hope in dark times',
    ];
    const randomTopic = wisdomTopics[Math.floor(Math.random() * wisdomTopics.length)];

    // Cancel existing re-engagement notifications to avoid spam
    if (this.isSupported) {
      // Assuming ID 99999 is reserved for re-engagement
      await LocalNotifications.cancel({ notifications: [{ id: 99999 }] });
    }

    await this.scheduleLocal({
      id: 99999, // Fixed ID so we can cancel/overwrite it
      title: 'Daily Wisdom Awaits',
      body: `Discover what the sacred texts say about ${randomTopic}.`,
      scheduleAt,
    });
  }

  /**
   * Unregister from push notifications
   */
  async unregister(): Promise<boolean> {
    try {
      if (this.isSupported) {
        await PushNotifications.removeAllListeners();
      }
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
    if (!this.isSupported) {
      if ('Notification' in window) {
        return {
          granted: Notification.permission === 'granted',
          denied: Notification.permission === 'denied',
        };
      }
      return { granted: false, denied: false };
    }

    try {
      const status = await PushNotifications.checkPermissions();
      return {
        granted: status.receive === 'granted',
        denied: status.receive === 'denied',
      };
    } catch (e) {
      return { granted: false, denied: false };
    }
  }
}

export const notificationService = new NotificationService();
