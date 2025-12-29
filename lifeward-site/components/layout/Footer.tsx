import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-serif font-semibold mb-4">LIFEWARD</h3>
            <p className="text-small text-secondary max-w-reading">
              A platform for clarity, practice, and abundant life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigate</h4>
            <ul className="space-y-2 text-small">
              <li>
                <Link href="/start-here" className="text-secondary hover:text-foreground transition-colors">
                  Start Here
                </Link>
              </li>
              <li>
                <Link href="/coaching" className="text-secondary hover:text-foreground transition-colors">
                  Coaching
                </Link>
              </li>
              <li>
                <Link href="/sessions" className="text-secondary hover:text-foreground transition-colors">
                  Sessions
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-secondary hover:text-foreground transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/library" className="text-secondary hover:text-foreground transition-colors">
                  Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-small">
              <li>
                <Link href="/about" className="text-secondary hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-secondary hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-small text-secondary text-center md:text-left">
              © {new Date().getFullYear()} Lifeward. All rights reserved.
            </p>
            <div className="flex gap-6 text-small">
              <Link href="/privacy" className="text-secondary hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-secondary hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

