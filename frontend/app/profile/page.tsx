'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header-loggedin';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, User as UserIcon, Mail, GraduationCap, Trophy, Star } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

interface UserProfile {
  username: string;
  email: string;
  account_type: string;
  level?: string;
  learner_points?: number;
  achievements?: string[];
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Fetch secure user details using the token
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // If token is invalid (e.g. expired), clear it and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column: User Card */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/avatars/01.png" alt={user.username} />
                    <AvatarFallback className="text-2xl">
                        {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.username}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{user.account_type}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize">
                        {user.level || "Beginner"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <GraduationCap className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Role</p>
                      <p className="font-medium capitalize">{user.account_type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats & Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/5 rounded-xl flex flex-col items-center justify-center text-center">
                        <Star className="h-8 w-8 text-yellow-500 mb-2" />
                        <span className="text-2xl font-bold">{user.learner_points || 0}</span>
                        <span className="text-sm text-muted-foreground">Learner Points</span>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-xl flex flex-col items-center justify-center text-center">
                        <Trophy className="h-8 w-8 text-orange-500 mb-2" />
                        <span className="text-2xl font-bold">{user.achievements?.length || 0}</span>
                        <span className="text-sm text-muted-foreground">Achievements</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}