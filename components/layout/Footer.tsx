import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-200 bg-white mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left text-sm text-gray-600">
            <p className="mb-2">
              &copy; {currentYear} Albert Blibo. All rights reserved.
            </p>
            <p className="text-gray-500">
              Built with clarity, discipline, and purpose.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link 
              href="/rss" 
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/>
              </svg>
              RSS Feed
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

