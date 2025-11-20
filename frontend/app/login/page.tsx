'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, LockKeyhole } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; 

// API running on port 5000
const API_BASE_URL = 'http://localhost:5000'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      toast({
        title: 'Login Successful!',
        description: `Welcome back, ${user.username}.`,
        variant: 'default',
      });

      // Force redirect
      if (typeof window !== 'undefined') {
          window.location.replace('/main');
      }

    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || error.message; 
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-[380px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to AcademyX</CardTitle>
          <CardDescription>
            Enter your email and password below to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                  required
                />
              </div>
              <div className="text-right">
                <Link href="/forgot-password">
                    <Button variant="link" type="button" className="p-0 h-auto text-sm">
                        Forgot Password?
                    </Button>
                </Link>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
                Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}