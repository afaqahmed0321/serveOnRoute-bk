/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

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
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log("this is otppppp", otp)
    try {
      await this.twilioClient.messages.create({
        body: `Your verification code is: ${otp}`,
        to: phone_number, 
        from: process.env.TWILIO_PHONE_NUMBER,
      });

      console.log('OTP sent successfully'); 
      return `${otp}`;
      
    } catch (error) {
      console.error('Error sending OTP:', error); 
      throw error;
    }
  }

  async verifyOTP(phone_number: string, otp: string) {
    try {
      const serviceSid = process.env.TWILIO_SERVICE_SID;
      if (!serviceSid) {
        throw new Error('TWILIO_SERVICE_SID environment variable is not defined');
      }
  
      const verificationCheck = await this.twilioClient.verify
        .v2.services(serviceSid)
        .verificationChecks.create({
          to: phone_number,
          code: otp,
        });
  
      console.log('Verification check response:', verificationCheck);
  
      // Return true if OTP is valid
      return verificationCheck.status === 'approved';
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }
}
