import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/config/firebase";

interface MessOwnerSignupProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

const MessOwnerSignup = ({ formData, handleChange, isLoading }: MessOwnerSignupProps) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const sendOtp = async () => {
    if (!formData.phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      toast.error("Please enter a valid Indian phone number");
      return;
    }

    try {
      const sendOtpFunction = httpsCallable(functions, "sendOtp");
      const response = await sendOtpFunction({ phoneNumber: formData.phone });
      
      if (response.data.success) {
        toast.success("OTP sent successfully");
        setOtpSent(true);
        startResendTimer();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      const verifyOtpFunction = httpsCallable(functions, "verifyOtp");
      const response = await verifyOtpFunction({ 
        phoneNumber: formData.phone, 
        code: otp 
      });

      if (response.data.success) {
        toast.success("Phone number verified successfully");
        setOtpVerified(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify OTP");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex gap-2">
            <Input
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              required
              value={formData.phone}
              onChange={handleChange}
              disabled={otpVerified}
              className="flex-1"
            />
            {!otpSent ? (
              <Button 
                onClick={sendOtp} 
                disabled={isLoading || otpVerified}
              >
                Send OTP
              </Button>
            ) : !otpVerified && (
              <Button 
                onClick={sendOtp} 
                disabled={resendTimer > 0}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </Button>
            )}
          </div>
        </div>

        {otpSent && !otpVerified && (
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <div className="flex gap-2">
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1"
              />
              <Button onClick={verifyOtp}>
                Verify OTP
              </Button>
            </div>
          </div>
        )}
      </div>

      {otpVerified && (
        <div className="p-2 bg-green-50 text-green-700 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Phone number verified successfully
        </div>
      )}
    </div>
  );
};

export default MessOwnerSignup;