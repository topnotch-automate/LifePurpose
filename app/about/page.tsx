import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "About",
  description: "About the author, teacher, and guide behind Esoteriment and Lifeward.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            About
          </h1>
        </header>

        <div className="prose prose-lg max-w-none article-content">
          <p className="text-xl text-gray-700 mb-6">
            I write to awaken clarity, discipline, and life.
          </p>
          
          <p className="mb-4">
            This platform represents a unified vision of wisdom and practice. 
            Through <strong>Esoteriment</strong>, I simplify the unseen—making 
            esoteric, metaphysical, and mystical concepts clear, grounded and accessible.
            Through <strong>Lifeward</strong>, I focus on living the truth—applying God’s
            timeless principles in daily life for a more ordered and abundant life.
          </p>
          
          <p className="mb-4">
            I believe that understanding without application is incomplete. 
            Knowledge must move from thought into action, from contemplation into daily practice.
          </p>
          
          <p className="mb-4">
            Every article, video, and book here is written with a single purpose:
            to help you live with greater clarity, deeper discipline, and a more abundant life.
          </p>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-gray-600 mb-6">
              For inquiries, collaborations, or feedback, please reach out through 
              the contact form below.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

