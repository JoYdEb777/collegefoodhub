const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

admin.initializeApp();

const twilioClient = twilio(
  functions.config().twilio.account_sid,
  functions.config().twilio.auth_token
);

exports.sendOtp = functions.https.onCall(async (data, context) => {
  const { phoneNumber } = data;

  if (!phoneNumber) {
    throw new functions.https.HttpsError("invalid-argument", "Phone number is required.");
  }

  try {
    const verification = await twilioClient.verify
      .services(functions.config().twilio.service_sid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    return { success: true, status: verification.status };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

exports.verifyOtp = functions.https.onCall(async (data, context) => {
  const { phoneNumber, code } = data;

  if (!phoneNumber || !code) {
    throw new functions.https.HttpsError("invalid-argument", "Phone number and code are required.");
  }

  try {
    const verificationCheck = await twilioClient.verify
      .services(functions.config().twilio.service_sid)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verificationCheck.status === "approved") {
      return { success: true };
    } else {
      throw new Error("Invalid OTP");
    }
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
