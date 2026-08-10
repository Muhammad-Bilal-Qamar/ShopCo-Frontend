import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState("EMAIL"); // 'EMAIL' | 'SHOW_SUCCESS' | 'OTP' | 'RESET' | 'COMPLETE'
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    successMessage: "",
  });

  // STEP 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", successMessage: "" });

    try {
      await axios.post("/api/Users/forgot-password", {
        ResetEmail: email,
      });

      // Move to success screen
      setStep("SHOW_SUCCESS");
      setStatus({
        loading: false,
        error: "",
        successMessage: "✅ Reset Code sent! Please check your email inbox.",
      });

      // Hold message for 3 seconds, then transition to OTP step
      setTimeout(() => {
        setStep("OTP");
        setStatus((prev) => ({ ...prev, successMessage: "" }));
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      setStatus({ loading: false, error: errorMessage, successMessage: "" });
    }
  };

  // Helper to handle OTP input updates and automatic focus shifting
  const handleOtpChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Shift focus to the next box if typed
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Shift focus back to the previous box on Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // STEP 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setStatus({ ...status, error: "Please enter all 6 digits." });
      return;
    }

    setStatus({ loading: true, error: "", successMessage: "" });

    try {
      await axios.post("/api/Users/verify-otp", {
        Email: email,
        OTPCode: otpCode,
      });

      setStep("RESET");
      setStatus({ loading: false, error: "", successMessage: "" });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Invalid or expired OTP code.";
      setStatus({ loading: false, error: errorMessage, successMessage: "" });
    }
  };

  // STEP 3: Reset Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus({ ...status, error: "Passwords do not match." });
      return;
    }

    setStatus({ loading: true, error: "", successMessage: "" });

    try {
      await axios.post("/api/Users/reset-password", {
        Email: email,
        NewPassword: newPassword,
        ConfirmNewPassword: confirmPassword,
      });

      setStep("COMPLETE");
      setStatus({
        loading: false,
        error: "",
        successMessage: "Password updated successfully!",
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to reset password.";
      setStatus({ loading: false, error: errorMessage, successMessage: "" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {step === "RESET" ? "Reset Password" : "Forgot your password?"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === "EMAIL" &&
              "Enter your email address and we will send you a code."}
            {step === "SHOW_SUCCESS" && "Code dispatching..."}
            {step === "OTP" &&
              `Enter the 6-digit verification code sent to ${email}`}
            {step === "RESET" && "Type your secure new password details below."}
            {step === "COMPLETE" &&
              "Your password has been changed successfully!"}
          </p>
        </div>

        {/* --- STEP 1.5: SUCCESS ALERT (HOLDS FOR 3 SECONDS) --- */}
        {step === "SHOW_SUCCESS" && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 text-center animate-pulse">
            {status.successMessage}
          </div>
        )}

        {/* --- STEP 1: EMAIL INPUT --- */}
        {step === "EMAIL" && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            {status.error && (
              <div className="text-sm text-red-600">⚠️ {status.error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={status.loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {status.loading ? "Sending..." : "Send Reset Code"}
              </button>
            </div>
          </form>
        )}

        {/* --- STEP 2: 6-DIGIT OTP INPUT PLACEHOLDERS --- */}
        {step === "OTP" && (
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e.target, index)}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-900 placeholder-gray-300"
                  placeholder="-"
                />
              ))}
            </div>

            {status.error && (
              <div className="text-sm text-red-600">⚠️ {status.error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={status.loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {status.loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          </form>
        )}

        {/* --- STEP 3: RESET PASSWORD FIELDS --- */}
        {step === "RESET" && (
          <form className="mt-8 space-y-4" onSubmit={handleResetSubmit}>
            <div>
              <label htmlFor="new-password" className="sr-only">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="New Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>

            {status.error && (
              <div className="text-sm text-red-600">⚠️ {status.error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={status.loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {status.loading ? "Updating..." : "Reset Password"}
              </button>
            </div>
          </form>
        )}

        {/* --- STEP 4: SUCCESS / COMPLETE SCREEN --- */}
        {step === "COMPLETE" && (
          <div className="mt-8 text-center space-y-4">
            <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
              🎉 Your password has been successfully updated!
            </div>
            <a
              href="/login"
              className="inline-block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition"
            >
              Go to Login
            </a>
          </div>
        )}

        {/* --- FOOTER BACK-TO-LOGIN --- */}
        {step !== "COMPLETE" && (
          <div className="text-center">
            <a
              href="/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Back to sign in
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
