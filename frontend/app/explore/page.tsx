'use client';

import { useEffect, useState } from "react";
import { CourseCard } from "@/components/course-card"; 
import { Header } from "@/components/header-loggedin"; 
import { Footer } from "@/components/footer";

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  instructor: {
    name: string;
    avatar: string;
  };
  rating?: number;
  completion?: number;
  number_of_videos?: number;
}

const API_URL = "http://localhost:5000/api/courses";

// Updated static courses with local images
const STATIC_COURSES: Course[] = [
  {
    _id: "static-1",
    title: "Complete Full Stack Developer Bootcamp 2024",
    thumbnail: "html5.jpeg", // Using your uploaded html5 image
    tags: ["Web Development", "React", "Node.js"],
    instructor: { name: "John Doe", avatar: "" },
    rating: 4.9,
    // completion is omitted here, so the bar won't show
  },
  {
    _id: "static-2",
    title: "Python for Data Science and Machine Learning",
    thumbnail: "Picture1.png", // Using your uploaded Picture1
    tags: ["Data Science", "Python", "ML"],
    instructor: { name: "Jane Smith", avatar: "" },
    rating: 4.8,
  },
  {
    _id: "static-3",
    title: "The Ultimate Digital Marketing Course",
    thumbnail: "Picture2.png", // Using your uploaded Picture2
    tags: ["Marketing", "SEO", "Social Media"],
    instructor: { name: "Mike Johnson", avatar: "" },
    rating: 4.7,
  }
];

export default function ExplorePage() {
  const [courses, setCourses] = useState<Course[]>(STATIC_COURSES); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(API_URL);
        
        if (response.ok) {
          const coursesData = await response.json();
          if (Array.isArray(coursesData)) {
             // Combine static courses with any found in the database
             setCourses([...STATIC_COURSES, ...coursesData]); 
          }
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Explore Courses</h1>
        
        {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p className="text-lg">No courses available at the moment.</p>
            </div>
        ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
                <div key={course._id}>
                <CourseCard 
                    id={course._id}
                    title={course.title}
                    thumbnail={course.thumbnail}
                    tags={course.tags}
                    instructor={course.instructor}
                    rating={course.rating}
                    // completion prop is intentionally NOT passed here
                    // to prevent the progress bar from showing.
                />
                </div>
            ))}
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
}