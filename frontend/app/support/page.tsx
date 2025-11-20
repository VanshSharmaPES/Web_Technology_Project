import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Layout, Server } from 'lucide-react'

export default function SupportPage() {
  const techStack = [
    {
      category: "Frontend",
      technologies: [
        {
          name: "React",
          description: "A JavaScript library for building user interfaces",
          details: "React allows us to create reusable UI components and manage the state of our application efficiently. It's the foundation of our frontend, enabling a smooth and responsive user experience."
        },
        {
          name: "Tailwind CSS",
          description: "A utility-first CSS framework",
          details: "Tailwind CSS provides low-level utility classes that let us build completely custom designs without ever leaving our HTML. It helps us create responsive layouts and consistent styling across our application."
        },
        {
          name: "shadcn/ui",
          description: "A collection of re-usable components",
          details: "shadcn/ui offers a set of accessible, customizable, and beautifully designed React components. It accelerates our development process by providing pre-built components that we can easily modify to fit our needs."
        }
      ]
    },
    {
      category: "Middleware",
      technologies: [
        {
          name: "Firebase",
          description: "A platform for building web and mobile applications",
          details: "We use Firebase for authentication, providing a secure and easy-to-implement user sign-up and login system. It offers features like email/password authentication, social media login, and more."
        },
        {
          name: "Express",
          description: "A minimal and flexible Node.js web application framework",
          details: "Express provides a robust set of features for web and mobile applications. We use it to handle routing, making it easy to create a RESTful API for our application."
        },
        {
          name: "CORS",
          description: "Cross-Origin Resource Sharing",
          details: "CORS is a security feature implemented to control access to resources (e.g., APIs) on a web server from a different domain. It helps protect our application from unauthorized access."
        },
        {
          name: "Axios",
          description: "A promise-based HTTP client",
          details: "Axios simplifies the process of making HTTP requests. We use it to communicate between our frontend and backend, handling data fetching and submission in a clean and efficient manner."
        }
      ]
    },
    {
      category: "Backend",
      technologies: [
        {
          name: "MongoDB",
          description: "A document-based NoSQL database",
          details: "MongoDB allows us to store and retrieve data in a flexible, JSON-like format. It's particularly well-suited for applications with complex data structures and provides excellent scalability."
        },
        {
          name: "Node.js",
          description: "A JavaScript runtime built on Chrome's V8 JavaScript engine",
          details: "Node.js enables us to run JavaScript on the server-side. We use it to host our backend server, handle API requests, and perform server-side operations."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex justify-between items-center">
            <Image src="/logo.svg" alt="AcademyX Logo" width={150} height={40} />
            <div className="space-x-4">
              <Link href="/courses" className="text-blue-600 hover:text-blue-800">Courses</Link>
              <Link href="/teachers" className="text-blue-600 hover:text-blue-800">Teachers</Link>
              <Button asChild><Link href="/signup">Get Started</Link></Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Tech Stack</h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore the technologies powering our educational platform
          </p>
        </section>

        <Tabs defaultValue="Frontend" className="w-full mb-16">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Frontend">Frontend</TabsTrigger>
            <TabsTrigger value="Middleware">Middleware</TabsTrigger>
            <TabsTrigger value="Backend">Backend</TabsTrigger>
          </TabsList>
          {techStack.map((category) => (
            <TabsContent key={category.category} value={category.category}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.technologies.map((tech) => (
                  <Card key={tech.name}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {category.category === "Frontend" && <Layout className="h-5 w-5" />}
                        {category.category === "Middleware" && <Server className="h-5 w-5" />}
                        {category.category === "Backend" && <Database className="h-5 w-5" />}
                        {tech.name}
                      </CardTitle>
                      <CardDescription>{tech.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{tech.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Need Further Assistance?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our support team is here to help you with any technical questions
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </section>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p>&copy; 2023 AcademyX. All rights reserved.</p>
            <div className="space-x-4">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-800">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-800">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}