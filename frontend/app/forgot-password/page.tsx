'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { auth, sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from '@/lib/firebase'; // Import Firebase functions
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'; // Import OTP components

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpValid, setIsOtpValid] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const router = useRouter();

  // Step 1: Send OTP to the email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email); // Send OTP via Firebase email
      setIsEmailSent(true); // OTP has been sent
    } catch (err: any) {
      setError('Failed to send OTP. Please check your email.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify the OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Firebase verification of the OTP
      const emailAddress = await verifyPasswordResetCode(auth, otp); // Verify OTP
      setIsOtpValid(true); // OTP verified

      // Prompt user to reset the password
      setPasswordReset(true);
    } catch (err: any) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset the password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      // Reset the password in Firebase
      await confirmPasswordReset(auth, otp, newPassword);
      router.push('/login'); // Redirect to login page after password reset
    } catch (err: any) {
      setError('Failed to reset password. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg px-8 py-10">
            <h1 className="text-2xl font-bold text-center mb-6">ACADEMYX</h1>
            
            {!isEmailSent ? (
              // Step 1: Email input form
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Get OTP'}
                </Button>
              </form>
            ) : !isOtpValid ? (
              // Step 2: OTP input form using shadcn OTP component
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                    <InputOTPGroup>
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                    <InputOTPSeparator />
                  </InputOTP>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
                  {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                </Button>
              </form>
            ) : passwordReset ? (
              // Step 3: Password reset form
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
              </form>
            ) : null}
          </div>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-gray-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
