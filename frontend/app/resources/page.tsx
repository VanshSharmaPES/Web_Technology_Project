// import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Book, PenToolIcon as Tool, HelpCircle, FileText } from 'lucide-react'
import { Header } from '@/components/header-loggedin'
import { Footer } from '@/components/footer'
export default function ResourcePage() {
  const resources = [
    {
      category: "For Students",
      items: [
        { title: "Learning Guides", icon: <Book className="h-6 w-6" />, description: "Tips on effective learning, time management, and study techniques." },
        { title: "Recommended Reading", icon: <FileText className="h-6 w-6" />, description: "Explore curated lists of books, articles, and research papers." },
        { title: "External Tools and Software", icon: <Tool className="h-6 w-6" />, description: "Tutorials and installation guides for course-related software." },
      ]
    },
    {
      category: "For Educators",
      items: [
        { title: "Instructor Handbook", icon: <Book className="h-6 w-6" />, description: "Comprehensive guide on creating and managing courses." },
        { title: "Content Creation Tools", icon: <Tool className="h-6 w-6" />, description: "Recommended tools for creating high-quality course content." },
        { title: "Marketing Resources", icon: <FileText className="h-6 w-6" />, description: "Strategies and templates for promoting your courses." },
      ]
    },
    {
      category: "General Resources",
      items: [
        { title: "FAQs", icon: <HelpCircle className="h-6 w-6" />, description: "Find answers to common questions about using Academy X." },
        { title: "Tutorials", icon: <FileText className="h-6 w-6" />, description: "Step-by-step video guides for navigating the platform." },
        { title: "Support", icon: <HelpCircle className="h-6 w-6" />, description: "24/7 support through live chat or ticket submission." },
        { title: "Policies", icon: <FileText className="h-6 w-6" />, description: "Review our terms of service, privacy policy, and guidelines." },
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header/>
    
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Resources</h1>
          <p className="text-xl text-gray-600 mb-8">
            Welcome to your hub for essential tools, guides, and references to enhance your learning journey.
          </p>
        </section>

        <Tabs defaultValue="For Students" className="w-full mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="For Students">For Students</TabsTrigger>
            <TabsTrigger value="For Educators">For Educators</TabsTrigger>
            <TabsTrigger value="General Resources">General Resources</TabsTrigger>
          </TabsList>
          {resources.map((category) => (
            <TabsContent key={category.category} value={category.category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <Card key={item.title}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {item.icon}
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Featured Free Resources</h2>
          <Card>
            <CardHeader>
              <CardTitle>Explore Our Free Offerings</CardTitle>
              <CardDescription>Get a head start on your learning or teaching journey with these complimentary resources.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Free introductory courses in various subjects</li>
                <li>Downloadable course creation templates for educators</li>
                <li>eBooks on effective learning strategies</li>
                <li>Sample lesson plans and curriculum outlines</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Start Your Learning Journey Today</h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore our extensive collection of resources and take your education to the next level.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </section>
      </main>
<Footer/>
    </div>
  )
}