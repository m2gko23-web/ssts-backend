import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PushNotificationDto {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private configService: ConfigService) {}

  // Send FCM push notification to a single device
  async sendToDevice(fcmToken: string, notification: PushNotificationDto): Promise<void> {
    try {
      // Firebase Admin SDK - will be initialized in main.ts
      // Using fetch to FCM v1 API directly
      const fcmUrl = `https://fcm.googleapis.com/v1/projects/${this.configService.get('FIREBASE_PROJECT_ID')}/messages:send`;
      this.logger.log(`Sending push notification to token: ${fcmToken.slice(0, 10)}...`);
      // TODO: Implement Firebase Admin SDK integration in MVP-2
      this.logger.log(`Notification: ${notification.title} - ${notification.body}`);
    } catch (error) {
      this.logger.error(`Failed to send notification: ${error.message}`);
    }
  }

  // Send to multiple devices (multicast)
  async sendToMultipleDevices(
    fcmTokens: string[],
    notification: PushNotificationDto,
  ): Promise<void> {
    const promises = fcmTokens
      .filter(token => !!token)
      .map(token => this.sendToDevice(token, notification));
    await Promise.allSettled(promises);
  }

  // Notify parent when student boards bus (EVT-01)
  async notifyStudentBoarded(parentFcmToken: string, studentName: string, busNumber: string): Promise<void> {
    await this.sendToDevice(parentFcmToken, {
      title: 'Student Boarded',
      body: `${studentName} has boarded bus ${busNumber}`,
      data: { type: 'EVT_BOARDED_BUS', studentName, busNumber },
    });
  }

  // Notify parent when student arrives at school (EVT-03)
  async notifyStudentArrivedAtSchool(parentFcmToken: string, studentName: string): Promise<void> {
    await this.sendToDevice(parentFcmToken, {
      title: 'Student Arrived at School',
      body: `${studentName} has safely arrived at school`,
      data: { type: 'EVT_ENTERED_SCHOOL', studentName },
    });
  }

  // Alert supervisor of agent rule violation
  async notifyAgentAlert(
    supervisorFcmToken: string,
    alertTitle: string,
    alertMessage: string,
    severity: string,
  ): Promise<void> {
    await this.sendToDevice(supervisorFcmToken, {
      title: `[${severity.toUpperCase()}] ${alertTitle}`,
      body: alertMessage,
      data: { type: 'AGENT_ALERT', severity },
    });
  }
}