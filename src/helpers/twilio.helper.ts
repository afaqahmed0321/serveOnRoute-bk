import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as Twilio from 'twilio';
require('dotenv').config();

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  // TWILIO_SERVICE_SID
} = process.env;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

@Injectable()
export class TwilioService {
  private readonly twilioClient: Twilio.Twilio;
  constructor() {
    this.twilioClient = Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async twilioSendOTP(phone_number: string) {
    // const sendOTP = await this.twilioClient.sendSMS(phone_number, 'This is message');
    try {
      const message = await this.twilioClient.messages.create({
        body: "this is message",
        to: phone_number,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      });

      console.log('Message sent:', message.sid);
      return "message successful";
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
    // console.log("this is sndOTP",sendOTP)
    // .verify.v2.services()
    // .verifications
    //   .create({
    //     to: `+${phone_number}`,
    //    })
    //   .then((message:any)=> {
    //     return message
    //   })
    //   .catch((err:any)=> {
    //     throw new InternalServerErrorException('Twilio Server Error',{cause:new Error(err)})
    //   });
    // return sendOTP;
  }

  async verifyOTP(phone_number: string, otp: string) {
    const clientResponse = await client.verify.v2
      .services()
      .verificationChecks.create({ to: `+${phone_number}`, code: `${otp}` });
    return clientResponse.valid;
  }
}
