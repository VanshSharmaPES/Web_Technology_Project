'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header-loggedin';
import { Footer } from '@/components/footer';
import { CourseCard } from '@/components/course-card';
import { Achievements } from '@/components/achievements';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// FIX 1: Imports for Dialog and Table components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // FIX 2: Added missing Badge import
import { Upload, Users } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = "http://localhost:5000/api";

interface User {
  username: string;
  email: string;
  level: string;
  achievements: string[];
  account_type: string;
  learner_points: number;
  courses_bought: {
    course_id: string;
    percentage_completed: number;
    number_of_videos_watched: number;
    course_title: string;
  }[];
}

// FIX 3: Updated Course interface to include rating
interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  instructor: {
    name: string;
    avatar: string;
  };
  number_of_videos: number;
  rating?: number; // Added optional rating property
}

interface EnrolledStudent {
  _id: string;
  username: string;
  email: string;
  level: string;
  learner_points: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [createdCourses, setCreatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState("");
  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const router = useRouter();

  const fetchUserData = async (email: string, token: string): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users/user/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data: User = await response.json();
      setUser(data);

      if (data.courses_bought && data.courses_bought.length > 0) {
         const enrolledResponse = await fetch(`${API_BASE_URL}/users/recommended`);
         if (enrolledResponse.ok) {
              const enrolledData: Course[] = await enrolledResponse.json();
              const myCourses = enrolledData.filter(c => 
                  data.courses_bought.some(bought => bought.course_id === c._id)
              );
              setEnrolledCourses(myCourses.length > 0 ? myCourses : enrolledData);
         }
      }

      if (data.account_type === 'teacher') {
        const createdResponse = await fetch(`${API_BASE_URL}/users/created/${encodeURIComponent(email)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const createdData = await createdResponse.json();
        if (createdResponse.ok && Array.isArray(createdData.created_courses)) {
          setCreatedCourses(createdData.created_courses);
        } else {
          setCreatedCourses([]);
        }
      }

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudents = async (courseId: string, courseTitle: string) => {
    setSelectedCourseTitle(courseTitle);
    setIsStudentDialogOpen(true);
    setLoadingStudents(true);
    setEnrolledStudents([]);

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/students`);
      if (response.ok) {
        const data = await response.json();
        setEnrolledStudents(data);
      } else {
        console.error("Failed to fetch students");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Helper to get completion percentage from user object
  const getCompletion = (courseId: string) => {
    const purchase = user?.courses_bought.find(c => c.course_id === courseId);
    return purchase ? purchase.percentage_completed : 0;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      router.push('/login');
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.email) {
        fetchUserData(parsedUser.email, token);
      } else {
        setError("Invalid user session.");
        setLoading(false);
      }
    } catch (err) {
      router.push('/login');
    }
  }, [router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-xl">Loading...</p></div>;
  if (error) return <div className="flex flex-col items-center justify-center min-h-screen gap-4"><p className="text-red-500">{error}</p><Button onClick={() => router.push('/login')}>Back to Login</Button></div>;
  if (!user) return <div>No user found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <Achievements achievements={user.achievements} level={user.level} />
          </div>
          {user.account_type === 'teacher' && (
            <div>
              <Button className="w-full" asChild>
                <Link href="/create-course">
                  <Upload className="mr-2 h-4 w-4" /> Create New Course
                </Link>
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="learning" className="mb-12">
          <TabsList>
            <TabsTrigger value="learning">Your Learning</TabsTrigger>
            {user.account_type === 'teacher' && (
              <TabsTrigger value="teaching">Your Teaching</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="learning">
            <h2 className="text-2xl font-bold mb-6">Continue Your Learning Journey</h2>
            {enrolledCourses.length === 0 ? (
                <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                    <CourseCard
                      key={course._id}
                      id={course._id}
                      title={course.title}
                      thumbnail={course.thumbnail}
                      tags={course.tags}
                      instructor={course.instructor}
                      completion={getCompletion(course._id)} // Calculated completion
                      rating={course.rating || 0} // Pass default rating
                    />
                ))}
                </div>
            )}
          </TabsContent>
          {user.account_type === 'teacher' && (
            <TabsContent value="teaching">
              <h2 className="text-2xl font-bold mb-6">Manage Your Courses</h2>
              {createdCourses.length === 0 ? (
                <p>No courses created yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdCourses.map((course) => (
                    <div key={course._id} className="flex flex-col gap-2">
                      <CourseCard
                        id={course._id}
                        title={course.title}
                        thumbnail={course.thumbnail}
                        tags={course.tags}
                        instructor={course.instructor}
                        completion={0}
                        rating={course.rating || 0}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-1"
                        onClick={() => handleViewStudents(course._id, course.title)}
                      >
                        <Users className="mr-2 h-4 w-4" /> View Enrolled Students
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>

        <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Students Enrolled in "{selectedCourseTitle}"</DialogTitle>
              <DialogDescription>
                List of all students currently registered for this course.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {loadingStudents ? (
                <p>Loading students...</p>
              ) : enrolledStudents.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No students enrolled yet.</p>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrolledStudents.map((student) => (
                        <TableRow key={student._id}>
                          <TableCell className="font-medium">{student.username}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell><Badge variant="outline">{student.level}</Badge></TableCell>
                          <TableCell className="text-right">{student.learner_points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <section>
          <h2 className="text-2xl font-bold mb-6">Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.slice(0,3).map((course) => (
              <CourseCard
                key={course._id}
                id={course._id}
                title={course.title}
                thumbnail={course.thumbnail}
                tags={course.tags}
                instructor={course.instructor}
                completion={0} 
                rating={course.rating || 0}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}