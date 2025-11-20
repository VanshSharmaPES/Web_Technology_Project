import Link from 'next/link'
import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-primary">
              ACADEMYX
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              A website where teacher is anybody with skill
            </p>
            <div className="flex space-x-4 mt-6">
              <Link href="https://github.com" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://linkedin.com" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/feature" className="text-muted-foreground hover:text-primary">Features</Link></li>
              <li><Link href="/resources" className="text-muted-foreground hover:text-primary">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">About</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link href="/support" className="text-muted-foreground hover:text-primary">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Teachers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Students</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Link 4</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 — 2034</p>
        </div>
      </div>
    </footer>
  )
}