import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface BlogPostLayoutProps {
  isDarkMode: boolean;
  post: {
    title: string;
    date: string;
    author: string;
    tag: string;
    content: string;
    references: string[];
  };
}

export function BlogPostLayout({ isDarkMode, post }: BlogPostLayoutProps) {
  const components: Components = {
    h1: ({node, ...props}) => <h1 {...props} className="text-3xl font-bold mt-8 mb-4 text-foreground" />,
    h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-semibold mt-6 mb-3 text-foreground" />,
    h3: ({node, ...props}) => <h3 {...props} className="text-xl font-medium mt-4 mb-2 text-foreground" />,
    p: ({node, ...props}) => <p {...props} className="mb-4 text-foreground leading-relaxed text-sm" />,
    a: ({node, ...props}) => <a {...props} className="text-primary hover:text-primary/80 underline" />,
    strong: ({node, ...props}) => <strong {...props} className="font-semibold text-foreground" />,
    em: ({node, ...props}) => <em {...props} className="italic text-foreground" />,
    ul: ({node, ...props}) => <ul {...props} className="list-disc pl-6 mb-4 text-foreground text-sm" />,
    ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-6 mb-4 text-foreground" />,
    li: ({node, ...props}) => <li {...props} className="mb-2 text-foreground text-sm" />,
    blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-primary pl-4 italic my-4 text-foreground" />,
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      return (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      )
    },
    img: ({node, ...props}) => <img {...props} className="max-w-full h-auto rounded-lg shadow-md my-4" alt={props.alt || ''} />,
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <main className="mt-32 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="text-sm text-muted-foreground">{post.date}</span>
            <span className="text-sm text-muted-foreground">{post.author}</span>
            {post.tag && (
              <span 
                className="px-3 py-1 text-xs font-semibold rounded-none border"
                style={{
                  borderColor: `hsl(var(--chart-${post.tag.toLowerCase()}))`,
                  backgroundColor: `color-mix(in srgb, hsl(var(--chart-${post.tag.toLowerCase()})) 20%, transparent)`,
                  color: `hsl(var(--chart-${post.tag.toLowerCase()}))`
                }}
              >
                {post.tag}
              </span>
            )}
          </div>
          <ReactMarkdown
            className="prose prose-lg dark:prose-invert max-w-none"
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={components}
          >
            {post.content}
          </ReactMarkdown>
          {post.references && post.references.length > 0 && (
            <div className="mt-12 border-t border-border pt-8">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">References</h2>
              <ul className="list-disc pl-6 space-y-2">
                {post.references.map((ref: string, index: number) => (
                  <li key={index} className="text-foreground">{ref}</li>
                ))}
              </ul>
            </div>
          )}
        </article>
      </main>
    </div>
  );
}