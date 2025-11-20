'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Users, Award, ChevronRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header-loggedin"; // Using the logged-in header as per your setup
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]" />
          <div className="container relative mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 text-center lg:text-left space-y-8">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  🚀 New courses added weekly
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Unlock Your Potential with <span className="text-primary">AcademyX</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  Master in-demand skills with our expert-led courses. Join a community of ambitious learners and transform your career today.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-lg" asChild>
                    <Link href="/explore">Start Learning Now <ChevronRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-lg" asChild>
                    <Link href="/explore">View All Courses</Link>
                  </Button>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-8 text-muted-foreground pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">10k+ Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium">500+ Courses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span className="font-medium">Expert Instructors</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl" />
                <div className="relative bg-card border rounded-2xl p-2 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                    alt="Students learning"
                    width={800}
                    height={600}
                    className="rounded-xl object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h2 className="text-3xl lg:text-4xl font-bold">Why Choose AcademyX?</h2>
                <div className="space-y-6">
                  {[
                    { title: "Expert Instructors", desc: "Learn from industry professionals with real-world experience." },
                    { title: "Interactive Learning", desc: "Engage with quizzes, coding exercises, and hands-on projects." },
                    { title: "Flexible Schedule", desc: "Learn at your own pace, anytime, anywhere, on any device." },
                    { title: "Certificate of Completion", desc: "Earn recognized certificates to showcase your skills." }
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-3xl" />
                <Image
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="Why choose us"
                  width={600}
                  height={800}
                  className="rounded-2xl shadow-2xl relative"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              Join thousands of students already learning on AcademyX. Sign up today and get unlimited access to all courses.
            </p>
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg" asChild>
              <Link href="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}