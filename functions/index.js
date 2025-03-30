const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

admin.initializeApp();

const twilioClient = twilio(
  functions.config().twilio.account_sid,
  functions.config().twilio.auth_token
);

const formatPhoneNumber = (phoneNumber) => {
  // Remove all non-numeric characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Add India country code if not present
  if (!cleaned.startsWith('91')) {
    cleaned = '91' + cleaned;
  }
  
  // Add + prefix
  return '+' + cleaned;
};

exports.sendOtp = functions.https.onCall(async (data, context) => {
  const { phoneNumber } = data;

  if (!phoneNumber) {
    throw new functions.https.HttpsError("invalid-argument", "Phone number is required.");
  }

  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const verification = await twilioClient.verify.v2
      .services(functions.config().twilio.service_sid)
      .verifications.create({ 
        to: formattedPhone, 
        channel: "sms",
        locale: "en" 
      });

    return { 
      success: true, 
      status: verification.status 
    };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

exports.verifyOtp = functions.https.onCall(async (data, context) => {
  const { phoneNumber, code } = data;

  if (!phoneNumber || !code) {
    throw new functions.https.HttpsError("invalid-argument", "Phone number and code are required.");
  }

  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const verificationCheck = await twilioClient.verify.v2
      .services(functions.config().twilio.service_sid)
      .verificationChecks.create({ 
        to: formattedPhone, 
        code 
      });

    if (verificationCheck.status === "approved") {
      // Update user document with verified phone status
      if (context.auth) {
        await admin.firestore()
          .collection('users')
          .doc(context.auth.uid)
          .update({
            phoneVerified: true,
            phoneVerifiedAt: admin.firestore.FieldValue.serverTimestamp()
          });
      }
      
      return { success: true };
    } else {
      throw new Error("Invalid OTP");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
