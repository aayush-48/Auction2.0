import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-russian-violet-2 bg-opacity-80 backdrop-filter backdrop-blur-lg py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-heliotrope font-bold text-lg mb-4">About IPL</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white hover:text-heliotrope transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/anti-corruption" className="text-white hover:text-heliotrope transition-colors">
                  Anti Corruption Policy
                </Link>
              </li>
              <li>
                <Link href="/anti-doping" className="text-white hover:text-heliotrope transition-colors">
                  Anti Doping Policy
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-white hover:text-heliotrope transition-colors">
                  Latest News
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-heliotrope font-bold text-lg mb-4">Guidelines</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/match-playing" className="text-white hover:text-heliotrope transition-colors">
                  Match Playing Conditions
                </Link>
              </li>
              <li>
                <Link href="/brand-guidelines" className="text-white hover:text-heliotrope transition-colors">
                  Brand Guidelines
                </Link>
              </li>
              <li>
                <Link href="/image-policy" className="text-white hover:text-heliotrope transition-colors">
                  Image Use Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-heliotrope font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-white hover:text-heliotrope transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/newsletters" className="text-white hover:text-heliotrope transition-colors">
                  Newsletters
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white hover:text-heliotrope transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-heliotrope font-bold text-lg mb-4">Follow IPL</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/ipl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-heliotrope transition-colors"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com/ipl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-heliotrope transition-colors"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com/ipl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-heliotrope transition-colors"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://youtube.com/ipl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-heliotrope transition-colors"
              >
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Indian Premier League. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

