"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-serif font-bold mt-8 mb-4 text-gray-900" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-serif font-semibold mt-6 mb-3 text-gray-900" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-serif font-semibold mt-4 mb-2 text-gray-900" {...props} />,
        p: ({ node, ...props }) => <p className="mb-4 leading-7 text-gray-800" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-[#7C8A9E] pl-6 pr-4 py-3 italic my-6 text-gray-700 text-lg font-serif bg-[#F5F4F2] rounded-r" {...props} />
        ),
        ul: ({ node, ...props }) => <ul className="list-disc list-outside mb-4 space-y-2 ml-6" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-outside mb-4 space-y-2 ml-6" {...props} />,
        li: ({ node, ...props }) => <li className="text-gray-800" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-[#7C8A9E] hover:text-[#9A7B4F] underline underline-offset-2" {...props} />
        ),
        strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        code: ({ node, className, children, ...props }: any) => {
          const isInline = !className || !className.includes("language-");
          if (isInline) {
            return (
              <code className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className="block p-4 bg-gray-100 text-gray-800 rounded-lg text-sm font-mono overflow-x-auto my-4" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

