import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Mail } from 'lucide-react'
import AKSHAT from "@/components/icons/AKSHAT.jpg";
import HIMANK from "@/components/icons/HIMANK.jpg";
import ARYAMAN from "@/components/icons/ARYAMAN.jpg";
import ABHYUDAY from "@/components/icons/ABHYUDAY.jpg";

export default function AboutPage() {
  const team = [
    {
      name: "Akshat Navalani",
      role: "Lead Developer",
      image: AKSHAT,
      description: "Worked on integration of all the components present on the website. All his work gets culminated on the MAIN PAGE.",
    },
    {
      name: "Himank Jain",
      role: "Full Stack Developer",
      image: HIMANK,
      description: "Worked on login page as well as the about page present on this website.",
    },
    {
      name: "Aryaman Sharma",
      role: "Full Stack Developer",
      image: ARYAMAN,
      description: "Worked on the sign in page and feature page.",
    },
    {
      name: "Abhyuday",
      role: "Full Stack Developer",
      image: ABHYUDAY,
      description: "Worked on the dashboard page and the support page.",
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
          <h1 className="text-4xl font-bold mb-4">Meet Our Team</h1>
          <p className="text-xl text-gray-600 mb-8">
            A group of ambitious developers giving education a different look
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {team.map((member) => (
            <Card key={member.name} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{member.description}</p>
                <div className="flex gap-4 mt-4">
                  <Button variant="ghost" size="icon">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Join Our Journey</h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the future of education with our innovative platform
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Get Started</Link>
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