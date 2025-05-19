import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-curex flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-curex">Curex</span>
            </div>

            <p className="text-gray-400 mb-6">
              Transforming healthcare through technology, making quality care accessible to everyone.
            </p>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-curex transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-curex transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-curex transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-curex transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Services", href: "/services" },
                { name: "Find a Doctor", href: "/doctors" },
                { name: "Health Assessment", href: "/Interview/questions" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-curex transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              {[
                { name: "Help Center", href: "/help" },
                { name: "FAQs", href: "/faqs" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Contact Us", href: "/contact" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-curex transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for health tips and updates.</p>

            <div className="flex space-x-2">
              <Input type="email" placeholder="Your email" className="bg-gray-800 border-gray-700 text-white" />
              <Button className="bg-curex hover:bg-curex-dark">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Curex. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
