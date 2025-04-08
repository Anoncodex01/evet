import axios from 'axios';

const API_BASE_URL = 'https://mambosms.co.tz/api/v1';
const SENDER_ID = 'E VET';

class SMSService {
  constructor() {
    this.token = null;
    this.pendingOTPs = new Map();
  }

  async sendOTP(phoneNumber) {
    try {
      // Check if there's a pending OTP request for this number
      const now = Date.now();
      const pendingOTP = this.pendingOTPs.get(phoneNumber);
      
      if (pendingOTP && now < pendingOTP.expirationTime) {
        // Return existing OTP if it hasn't expired
        return true;
      }

      // Generate new 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expirationTime = now + 5 * 60 * 1000; // 5 minutes
      
      const message = `Nambari yako ya uthibitisho ni: ${otp}. Tafadhali tumia nambari hii kujisajili kwenye E-VET.`;
      
      const response = await axios.post(
        `${API_BASE_URL}/sms/single`,
        {
          sender_id: SENDER_ID,
          message,
          mobile: phoneNumber.replace('+', '')
        },
        {
          headers: {
            'Authorization': 'Bearer 29|0FyrKIqamjfCc9XGRVoubKRBCyT7hjnuq2n7iGcpd6a3cc00',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success === true) {
        // Store OTP in memory
        this.pendingOTPs.set(phoneNumber, {
          otp,
          expirationTime,
          attempts: 0
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw new Error('Imeshindikana kutuma nambari ya uthibitisho. Tafadhali jaribu tena.');
    }
  }

  verifyOTP(phoneNumber, inputOTP) {
    const otpData = this.pendingOTPs.get(phoneNumber);
    
    // Check if OTP exists
    if (!otpData) {
      throw new Error('OTP has expired or was not sent');
    }

    // Check expiration
    if (Date.now() > otpData.expirationTime) {
      this.pendingOTPs.delete(phoneNumber);
      throw new Error('OTP has expired');
    }

    // Increment attempts
    otpData.attempts = (otpData.attempts || 0) + 1;
    this.pendingOTPs.set(phoneNumber, otpData);

    // Check attempts
    if (otpData.attempts >= 3) {
      this.pendingOTPs.delete(phoneNumber);
      throw new Error('Umejaribu mara nyingi. Tafadhali tuma OTP mpya.');
    }

    const isValid = otpData.otp.toString() === inputOTP;
    
    if (isValid) {
      this.pendingOTPs.delete(phoneNumber);
    } else {
      throw new Error('Nambari ya uthibitisho si sahihi. Tafadhali jaribu tena.');
    }

    return isValid;
  }
}

export const smsService = new SMSService();