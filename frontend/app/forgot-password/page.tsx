// frontend/app/forgot-password/page.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header as DynamicHeader } from '@/components/header-loggedin';
import { Footer } from '@/components/footer';
// REMOVED: Firebase imports
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import axios from 'axios'; // ADDED: axios import

const API_BASE_URL = 'http://localhost:5000'; 

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(''); // Token code from console
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const router = useRouter();

  // Step 1: Send request to backend to generate token
  const handleSendTokenRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // API call to Express backend to generate the token
      await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, { email });
      
      setIsEmailSent(true); 
    } catch (err: any) {
      let errorMessage = 'Failed to send reset code request. Please check your network connection.';
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Validate token format and move to password form
  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    // Since the actual token validation is done in the next step on the server, 
    // we only check local format here.
    if (otp.length !== 6) {
        setError('Please enter the 6-digit code from your console.');
        return;
    }
    
    setIsTokenValid(true); 
    setPasswordReset(true);
  };

  // Step 3: Reset the password (sends token, email, and new password to backend)
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
        // API call to Express backend to validate token and update password
        await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
            email,
            token: otp, 
            newPassword,
        });

      router.push('/login'); 
    } catch (err: any) {
      let errorMessage = 'Failed to reset password. Code may be invalid or expired.';
      if (axios.isAxiosError(err) && err.response) {
        errorMessage = err.response.data.message || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DynamicHeader />
      <main className="flex-grow flex items-center justify-center bg-background dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-md rounded-lg px-8 py-10">
            <h1 className="text-2xl font-bold text-center mb-6">NOVALEARN</h1>
            
            {!isEmailSent ? (
              // Step 1: Email input form
              <form onSubmit={handleSendTokenRequest} className="space-y-6"> 
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
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
                  {isLoading ? 'Sending Request...' : 'Get Reset Code'}
                </Button>
              </form>
            ) : !isTokenValid ? (
              // Step 2: Token (OTP) input form 
              <form onSubmit={handleVerifyToken} className="space-y-6">
                <p className="text-sm text-center text-muted-foreground">A password reset code has been generated. Check your **backend console** for the 6-digit code.</p>
                <div>
                  <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                    <InputOTPGroup>
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                    <InputOTPSeparator />
                  </InputOTP>
                  <p className="text-xs mt-2 text-center text-muted-foreground">
                      Enter the six-digit code printed in your server log.
                  </p>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
                  {isLoading ? 'Verifying Code...' : 'Verify Code'}
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
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
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