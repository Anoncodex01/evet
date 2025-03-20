import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { smsService } from '../services/smsService';
import { useRef } from 'react';

function OTPVerification({ phoneNumber, onVerificationComplete }) {
  const { completeSignUp } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const navigate = useNavigate();
  const hasInitialSendRef = useRef(false);

  useEffect(() => {
    if (!hasInitialSendRef.current) {
      hasInitialSendRef.current = true;
      handleSendOTP();
    }
  }, []);

  const handleSendOTP = async () => {
    setIsSendingOTP(true);
    setError('');
    try {
      await smsService.sendOTP(phoneNumber);
      setCountdown(60);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSendingOTP(false);
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && index < 5) {
      const nextInput = element.parentElement.nextElementSibling.querySelector('input');
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.target.parentElement.previousElementSibling.querySelector('input');
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const resendOTP = async () => {
    if (countdown === 0) {
      await handleSendOTP();
    }
  };

  const verifyOTP = async () => {
    setIsVerifying(true);
    setError('');
    const enteredOTP = otp.join('');
    
    try {
      const isValid = await smsService.verifyOTP(phoneNumber, enteredOTP);
      if (isValid) {
        // Get pending registration data
        const pendingData = JSON.parse(localStorage.getItem('pendingRegistration'));
        if (pendingData?.userId) {
          await completeSignUp(pendingData.userId);
          localStorage.removeItem('pendingRegistration');
        }

        if (onVerificationComplete) {
          onVerificationComplete({ success: true });
        }
      } else {
        throw new Error('Nambari ya uthibitisho si sahihi. Tafadhali jaribu tena.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Thibitisha Namba Yako
            </h2>
            <p className="text-gray-600">
              Tumetuma nambari ya uthibitisho kwenye namba: {phoneNumber}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {otp.map((digit, index) => (
              <div key={index} className="w-12">
                <input
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full h-12 text-center text-2xl border-2 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          <button
            onClick={verifyOTP}
            disabled={otp.includes('') || isVerifying}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isVerifying ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Inathibitisha...
              </>
            ) : (
              'Thibitisha'
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Hujapokea nambari?</p>
            <button
              onClick={resendOTP}
              disabled={countdown > 0}
              className="text-green-600 font-semibold hover:text-green-700 mt-2 disabled:text-gray-400"
            >
              {countdown > 0 ? `Jaribu tena baada ya sekunde ${countdown}` : 'Tuma Tena'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OTPVerification;