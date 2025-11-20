import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Header as DynamicHeader } from '@/components/header-loggedin'
import { Footer } from '@/components/footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DynamicHeader />
      <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
          <p className="text-lg text-gray-600 mb-8">
            We're here to help you. Send us a message or check our FAQs.
          </p>
          
          <div className="space-y-4">
            <Button size="lg" asChild>
              <a href="mailto:vanshsharma2006asr@gmail.com">Send an Email</a>
            </Button>
            <p className="text-sm text-muted-foreground">
              <Link href="/resources" className="underline">
                View our Resources and FAQ Page
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}