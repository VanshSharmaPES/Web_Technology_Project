'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header-loggedin'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Upload, BookOpen, Video, Loader2 } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

const NEXT_URI = "http://localhost:5000/api/courses";

// 1. Define proper interfaces to fix TypeScript errors
interface TopicType {
  title: string
  description: string
  videoUrl: string
  videoThumbnail: File | null
  videoThumbnailPreview: string | null
}

interface ChapterType {
  title: string
  topics: TopicType[]
}

interface CourseDataType {
  title: string
  description: string
  get_points: number
  tags: string[]
  number_of_videos: number
  thumbnail: File | null
  thumbnailPreview: string | null
}

export default function CreateCourse() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // 2. Initialize state with the defined interface
  const [courseData, setCourseData] = useState<CourseDataType>({
    title: '',
    description: '',
    get_points: 0,
    tags: [],
    number_of_videos: 0,
    thumbnail: null,
    thumbnailPreview: null,
  })

  const [chapters, setChapters] = useState<ChapterType[]>([{
    title: '',
    topics: [{
      title: '',
      description: '',
      videoUrl: '',
      videoThumbnail: null,
      videoThumbnailPreview: null
    }]
  }])

  // 3. Check Authentication & Teacher Role (No Firebase)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.account_type !== 'teacher') {
        toast({
          title: "Access Denied",
          description: "Only teachers can create courses.",
          variant: "destructive"
        });
        router.push('/dashboard');
      }
    } catch (e) {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, toast]);

  const addChapter = () => {
    setChapters([...chapters, {
      title: '',
      topics: [{
        title: '',
        description: '',
        videoUrl: '',
        videoThumbnail: null,
        videoThumbnailPreview: null
      }]
    }])
  }

  const addTopic = (chapterIndex: number) => {
    const newChapters = [...chapters]
    newChapters[chapterIndex].topics.push({
      title: '',
      description: '',
      videoUrl: '',
      videoThumbnail: null,
      videoThumbnailPreview: null
    })
    setChapters(newChapters)
  }

  const removeChapter = (chapterIndex: number) => {
    const newChapters = chapters.filter((_, index) => index !== chapterIndex)
    setChapters(newChapters)
  }

  const removeTopic = (chapterIndex: number, topicIndex: number) => {
    const newChapters = [...chapters]
    newChapters[chapterIndex].topics = newChapters[chapterIndex].topics.filter((_, index) => index !== topicIndex)
    setChapters(newChapters)
  }

  const handleCourseThumbnailUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCourseData(prev => ({ 
        ...prev, 
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file)
      }))
    }
  }

  const handleVideoThumbnailUpload = (chapterIndex: number, topicIndex: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newChapters = [...chapters]
      newChapters[chapterIndex].topics[topicIndex].videoThumbnail = file
      newChapters[chapterIndex].topics[topicIndex].videoThumbnailPreview = URL.createObjectURL(file)
      setChapters(newChapters)
    }
  }

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return;
    
    const user = JSON.parse(userStr);

    const formData = new FormData()
    formData.append('title', courseData.title)
    formData.append('description', courseData.description)
    formData.append('get_points', courseData.get_points.toString())
    formData.append('tags', JSON.stringify(courseData.tags))
    
    const totalVideos = chapters.reduce((acc, chapter) => acc + chapter.topics.length, 0);
    formData.append('number_of_videos', totalVideos.toString())
    formData.append('email', user.email) // Use email from localStorage
    
    if (courseData.thumbnail) {
      formData.append('thumbnail', courseData.thumbnail)
    }

    // Transform chapters for backend
    const chaptersData = chapters.map(c => ({
        title: c.title,
        topics: c.topics.map(t => ({
            title: t.title,
            description: t.description,
            videoUrl: t.videoUrl
        }))
    }));
    formData.append('chapters', JSON.stringify(chaptersData));

    try {
      const response = await axios.post(`${NEXT_URI}/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      })

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Course created successfully!",
        })
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error creating course:', error)
      toast({
        title: "Error",
        description: "Failed to create course.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md">
          <CardHeader className="bg-gray-100 dark:bg-gray-700 p-6 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">Create an Engaging Course</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleFormSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseTitle">Course Title</Label>
                    <Input 
                      id="courseTitle"
                      placeholder="Enter an inspiring title"
                      value={courseData.title}
                      onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseDescription">Course Description</Label>
                    <Textarea 
                      id="courseDescription"
                      placeholder="Describe your course" 
                      value={courseData.description}
                      onChange={(e) => setCourseData(prev => ({ ...prev, description: e.target.value }))} 
                      required
                      className="h-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coursePoints">Points to Earn</Label>
                    <Input 
                      id="coursePoints"
                      type="number" 
                      value={courseData.get_points}
                      onChange={(e) => setCourseData(prev => ({ ...prev, get_points: parseInt(e.target.value) || 0 }))} 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseTags">Tags</Label>
                    <Input 
                      id="courseTags"
                      placeholder="Enter tags (comma-separated)" 
                      value={courseData.tags.join(', ')}
                      onChange={(e) => setCourseData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))} 
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {courseData.tags.filter(t => t).map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Course Thumbnail</Label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="courseThumbnail" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative overflow-hidden">
                        {courseData.thumbnailPreview ? (
                          <Image 
                            src={courseData.thumbnailPreview} 
                            alt="Thumbnail Preview" 
                            layout="fill" 
                            objectFit="cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-4 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                          </div>
                        )}
                        <Input 
                          id="courseThumbnail" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleCourseThumbnailUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {chapters.map((chapter, chapterIndex) => (
                  <AccordionItem value={`chapter-${chapterIndex}`} key={chapterIndex} className="border rounded-lg mb-4">
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                           <BookOpen className="h-5 w-5 text-gray-500" />
                           <Input 
                             placeholder={`Chapter ${chapterIndex + 1} Title`}
                             value={chapter.title}
                             onChange={(e) => {
                               const newChapters = [...chapters]
                               newChapters[chapterIndex].title = e.target.value
                               setChapters(newChapters)
                             }}
                             className="font-semibold border-transparent hover:border-input"
                           />
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeChapter(chapterIndex)
                          }} 
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      {chapter.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="space-y-4 mb-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                          <div className="flex justify-between items-start">
                             <h4 className="text-sm font-medium uppercase text-muted-foreground">Topic {topicIndex + 1}</h4>
                             <Button variant="ghost" size="sm" onClick={() => removeTopic(chapterIndex, topicIndex)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                          </div>
                          <Input 
                            placeholder="Topic Title"
                            value={topic.title}
                            onChange={(e) => {
                              const newChapters = [...chapters]
                              newChapters[chapterIndex].topics[topicIndex].title = e.target.value
                              setChapters(newChapters)
                            }} 
                          />
                          <Textarea 
                            placeholder="Topic Description"
                            value={topic.description}
                            onChange={(e) => {
                              const newChapters = [...chapters]
                              newChapters[chapterIndex].topics[topicIndex].description = e.target.value
                              setChapters(newChapters)
                            }} 
                          />
                          <Input 
                            placeholder="Video URL (e.g. YouTube)"
                            value={topic.videoUrl}
                            onChange={(e) => {
                              const newChapters = [...chapters]
                              newChapters[chapterIndex].topics[topicIndex].videoUrl = e.target.value
                              setChapters(newChapters)
                            }} 
                          />
                        </div>
                      ))}
                      <Button type="button" variant="outline" onClick={() => addTopic(chapterIndex)} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Topic
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <Button type="button" variant="secondary" onClick={addChapter} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Chapter
              </Button>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Course'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}