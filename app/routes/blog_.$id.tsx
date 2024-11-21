import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/lib/prisma";
import invariant from "tiny-invariant";
import { useAppContext } from "~/root";
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { LinksFunction } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" },
];

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  tag: string;
  references: string[];
}

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  invariant(id, "Expected params.id");

  const post = await db.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({
    ...post,
    createdAt: post.createdAt.toISOString().split('T')[0],
  });
};

export default function BlogPost() {
  const post = useLoaderData<typeof loader>();
  const { isDarkMode } = useAppContext();

  return (
    <div className={`bg-background ${isDarkMode ? 'dark' : ''}`}>
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <article className="prose prose-lg mx-auto dark:prose-invert">
          <h1 className="text-4xl font-bold mb-4 text-foreground">{post.title}</h1>
          <div className="flex items-center space-x-4 mb-8">
            <span className="text-sm text-muted-foreground">{post.createdAt}</span>
            <span className="text-sm text-muted-foreground">{post.author}</span>
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
          </div>
          <ReactMarkdown
            className="prose-headings:text-secondary-foreground prose-p:foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-code:text-foreground prose-blockquote:text-foreground prose-ol:text-foreground prose-ul:text-foreground"
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {post.content}
          </ReactMarkdown>
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2 text-foreground">References</h2>
            <ul>
              {post.references.map((ref: string, index: number) => (
                <li key={index} className="text-foreground">{ref}</li>
              ))}
            </ul>
          </div>
        </article>
      </main>
    </div>
  );
}