import * as firebase from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

let JSONdata = require('./routeon-config.json');

@Injectable()
export class FirebaseService {
  private readonly messaging: firebase.messaging.Messaging;

  constructor() {
    firebase.initializeApp({
      credential: firebase.credential.cert(JSONdata),
    });
    this.messaging = firebase.messaging();
  }

  async sendPushNotification(payload: NotificationPayload) {
    console.log('notification-payload--->>>', payload);
    return await this.messaging.send(payload);
  }

  async sendMultipleDevicesPushNotification(payload: MultiNotificationPayload) {
    return await this.messaging.sendMulticast(payload);
  }
}

interface NotificationPayload {
  token: string;
  notification: {
    title: string;
    body: string;
  };
}

interface MultiNotificationPayload {
  tokens: [string];
  notification: {
    title: string;
    body: string;
  };
}
