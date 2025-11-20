// import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Header } from '@/components/header-loggedin'
import { Footer } from '@/components/footer'
export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header/>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Discover a New Side of Education</h1>
          <p className="text-xl text-gray-600 mb-8">
            An interactive platform that revolutionizes learning for both students and teachers.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">For Teachers</h2>
          <ul className="list-disc pl-8 space-y-2">
            <li>Access to a dedicated course creation page</li>
            <li>Tools to create interactive and engaging course materials</li>
            <li>Features to manage and track student progress</li>
            <li>Customizable content options for diverse teaching styles</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">For Students</h2>
          <ul className="list-disc pl-8 space-y-2">
            <li>Browse and access a wide range of courses on the explore page</li>
            <li>Monitor progress across all enrolled courses</li>
            <li>Earn points for completing courses and activities</li>
            <li>Enjoy a personalized learning experience with course recommendations</li>
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-4">Why Choose Our Platform?</h2>
          <ul className="list-disc pl-8 space-y-2">
            <li>Tailored experiences for both teachers and students</li>
            <li>Interactive and engaging course content</li>
            <li>Progress tracking and reward system</li>
            <li>User-friendly interface for course creation and exploration</li>
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Transform Your Educational Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our platform today and experience a new dimension of learning and teaching.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Get Started Now</Link>
          </Button>
        </section>
      </main>
<Footer/>
    </div>
  )
}