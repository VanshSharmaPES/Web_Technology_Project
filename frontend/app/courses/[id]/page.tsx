"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header-loggedin";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play, Star, ImageIcon, Lock, Edit } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import ReactPlayer from "react-player"; 

const NEXT_URI = "http://localhost:5000/api/courses";
const API_BASE_URL = "http://localhost:5000/api";

interface Topic {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: string | null;
}

interface Chapter {
  title: string;
  topics: Topic[];
}

interface Instructor {
  name: string;
  avatar: string;
  email: string;
}

interface CourseData {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  rating: number;
  tags: string[];
  chapters: Chapter[];
  isBought: boolean;
  instructor: Instructor;
  get_points: number;
}

interface UserData {
  username: string;
  email: string;
  account_type: string;
  learner_points: number;
  level: string;
  achievements: string[];
  courses_bought: string[];
}

export default function CourseView() {
  const { id } = useParams() as { id: string }
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [currentVideo, setCurrentVideo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get User Data from Local Storage
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
          throw new Error('User not authenticated. Please log in.');
        }

        const parsedUser = JSON.parse(storedUser);
        const userEmail = parsedUser.email;

        if (!userEmail) {
             throw new Error('User email not found in session.');
        }

        // 2. Fetch Data
        const [courseResponse, userResponse] = await Promise.all([
          fetch(`${NEXT_URI}/${id}`),
          fetch(`${API_BASE_URL}/users/user/${encodeURIComponent(userEmail)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          })
        ])

        if (!courseResponse.ok || !userResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const courseData = await courseResponse.json()
        const userData = await userResponse.json()

        setCourseData(courseData)
        setUserData(userData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const playVideo = (videoUrl: string) => {
    if (courseData?.isBought || (courseData?.chapters && videoUrl === courseData.chapters[0].topics[0].videoUrl)) {
      setCurrentVideo(videoUrl);
    } else {
      toast({
        title: "Course not purchased",
        description: "Please purchase the course to access this video.",
        variant: "destructive",
      });
    }
  };

  const buyCourse = async () => {
    if (!courseData || !userData) return

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${NEXT_URI}/buy`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          courseId: courseData._id, 
          userEmail: userData.email 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to purchase course')
      }

      toast({
        title: "Course purchased",
        description: "You now have access to all course content.",
      })
      
      setCourseData(prevData => prevData ? { ...prevData, isBought: true } : null)

      setUserData(prevData => {
        if (!prevData) return null
        return {
          ...prevData,
          learner_points: prevData.learner_points + (courseData.get_points || 0),
          courses_bought: [...prevData.courses_bought, courseData._id]
        }
      })
    } catch (err) {
      toast({
        title: "Purchase failed",
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: "destructive",
      })
    }
  }

  const isCreator = userData?.email === courseData?.instructor.email

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>
  if (!courseData || !userData) return <div className="flex justify-center items-center min-h-screen">No data available</div>

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="w-full aspect-[2/1] bg-muted relative group cursor-pointer" onClick={() => playVideo(courseData.chapters[0].topics[0].videoUrl)}>
          <Image
            src={`/thumbnails/${courseData.thumbnail}`}
            alt={courseData.title}
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-16 h-16 text-white" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative">
                {courseData.instructor && courseData.instructor.avatar ? (
                  <Image
                    src={courseData.instructor.avatar}
                    alt={courseData.instructor.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                        {courseData.instructor.name.charAt(0)}
                    </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">{courseData.title}</h1>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(courseData.rating)
                          ? "fill-primary text-primary"
                          : i < courseData.rating
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                     {typeof courseData.rating === 'number' ? courseData.rating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {!courseData.isBought && (
                <Button size="lg" onClick={buyCourse}>Buy Course</Button>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
                Earn {courseData.get_points} learner points
              </p>
              {isCreator && (
                <Link href={`/courses/${id}/edit`}>
                  <Button variant="outline" className="mt-2">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Course
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">COURSE DESCRIPTION:</h2>
            <p className="text-sm">{courseData.description}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-2">COURSE TAGS:</h2>
            <div className="flex flex-wrap gap-2">
              {courseData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-muted rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {courseData.chapters.map((chapter, chapterIndex) => (
              <AccordionItem
                value={`chapter-${chapterIndex}`}
                key={chapterIndex}
                className="border rounded-lg mb-2 px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="text-base font-medium">{chapter.title}</span>
                </AccordionTrigger>
                <AccordionContent>
                  {chapter.topics.map((topic, topicIndex) => (
                    <div
                      key={topicIndex}
                      className="mb-4 last:mb-0"
                    >
                      <div className="flex gap-4">
                        <div 
                          className="relative w-48 aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer"
                          onClick={() => playVideo(topic.videoUrl)}
                        >
                          {topic.videoThumbnail ? (
                            <Image
                              src={`/thumbnails/${topic.videoThumbnail || 'placeholder.svg'}`}
                              alt={topic.title}
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : courseData.thumbnail ? (
                            <Image
                              src={`/thumbnails/${courseData.thumbnail || 'placeholder.svg'}`}
                              alt="Course Thumbnail"
                              layout="fill"
                              objectFit="cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                            {courseData.isBought || (chapterIndex === 0 && topicIndex === 0) ? (
                              <Play className="w-12 h-12 text-white" />
                            ) : (
                              <Lock className="w-12 h-12 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">{topic.title}</h3>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {currentVideo && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
              <div className="fixed inset-[50%] w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] p-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                  <ReactPlayer
                    url={currentVideo}
                    controls
                    playing
                    width="100%"
                    height="100%"
                  />
                </div>
                <Button
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => setCurrentVideo(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}