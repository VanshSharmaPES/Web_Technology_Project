import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, Star, BarChart2, Calendar, Award, Globe, Clock, Shield } from 'lucide-react'

export default function AboutPage() {
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
          <h1 className="text-4xl font-bold mb-4">Discover AcademyX Features</h1>
          <p className="text-xl text-gray-600 mb-8">Revolutionizing online education with cutting-edge features for students and educators</p>
          <Button size="lg" asChild><Link href="/signup">Join Our Community</Link></Button>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Our Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-blue-500" />}
              title="Extensive Course Library"
              description="Explore a vast collection of courses spanning various disciplines and difficulty levels."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-blue-500" />}
              title="World-Class Instructors"
              description="Learn from industry leaders and renowned academics in their respective fields."
            />
            <FeatureCard
              icon={<Star className="h-8 w-8 text-blue-500" />}
              title="Advanced Rating System"
              description="Make informed decisions with our sophisticated course evaluation metrics."
            />
            <FeatureCard
              icon={<BarChart2 className="h-8 w-8 text-blue-500" />}
              title="Comprehensive Analytics"
              description="Gain deep insights into your learning progress with our advanced tracking tools."
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8 text-blue-500" />}
              title="Personalized Learning Paths"
              description="Receive tailored daily recommendations to optimize your learning journey."
            />
            <FeatureCard
              icon={<Award className="h-8 w-8 text-blue-500" />}
              title="Industry-Recognized Certifications"
              description="Earn valuable credentials to boost your professional profile."
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center">Why Choose AcademyX?</h2>
          <Tabs defaultValue="students" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="students">For Students</TabsTrigger>
              <TabsTrigger value="teachers">For Teachers</TabsTrigger>
            </TabsList>
            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Empower Your Learning Journey</CardTitle>
                  <CardDescription>Discover the benefits of learning with AcademyX</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BenefitItem icon={<Globe className="h-5 w-5" />} text="Access courses anytime, anywhere" />
                  <BenefitItem icon={<Clock className="h-5 w-5" />} text="Learn at your own pace" />
                  <BenefitItem icon={<Users className="h-5 w-5" />} text="Engage with a global community of learners" />
                  <BenefitItem icon={<BarChart2 className="h-5 w-5" />} text="Track your progress and set learning goals" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="teachers">
              <Card>
                <CardHeader>
                  <CardTitle>Share Your Expertise</CardTitle>
                  <CardDescription>Discover the benefits of teaching on AcademyX</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <BenefitItem icon={<Globe className="h-5 w-5" />} text="Reach a global audience of eager learners" />
                  <BenefitItem icon={<Shield className="h-5 w-5" />} text="Secure platform for content protection" />
                  <BenefitItem icon={<BarChart2 className="h-5 w-5" />} text="Detailed analytics on course performance" />
                  <BenefitItem icon={<Award className="h-5 w-5" />} text="Build your reputation as an expert educator" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Experience the Future of Online Learning</h2>
          <p className="text-xl text-gray-600 mb-8">Join the AcademyX community and unlock your full potential today!</p>
          <Button size="lg" asChild><Link href="/signup">Explore Features</Link></Button>
        </section>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p>&copy; 2023 AcademyX. All rights reserved.</p>
            <div className="space-x-4">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-800">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-800">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
      <Card>
        <CardHeader>
          <div className="mb-2">{icon}</div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
      </Card>
    );
  }
  

  function BenefitItem({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
      <div className="flex items-center space-x-2">
        {icon}
        <span>{text}</span>
      </div>
    );
  }
  