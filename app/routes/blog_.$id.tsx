import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import { db } from "~/lib/prisma";
import { useAppContext } from "~/root";
import type { LinksFunction } from "@remix-run/node";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BlogPostLayout } from "~/components/blog-post-layout";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" },
];

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  tag: string;
  references: string[];
}

function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

function formatDate(date: Date | string | null): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  } else if (typeof date === 'string') {
    return new Date(date).toISOString().split('T')[0];
  } else {
    return new Date().toISOString().split('T')[0]; // Default to current date if null
  }
}

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  if (!id || !isValidObjectId(id)) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const post = await db.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new Response("Not Found", { status: 404 });
    }

    return Response.json({
      ...post,
      date: formatDate(post.date),
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      throw new Response("Internal Server Error", { status: 500 });
    }
    if (error instanceof Response) throw error;
    throw new Response("Internal Server Error", { status: 500 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: "Post Not Found - BLOG" },
      { name: "description", content: "The requested blog post could not be found." },
    ];
  }
  return [
    { title: `BLOG - ${data.title}` },
    { name: "description", content: "HUDSON A. A PUBLIC ARCHIVE TO DOCUMENT MY INTERESTS, WORK AND PASSIONS." },
  ];
};

export default function BlogPost() {
  const post = useLoaderData<Post>();
  const { isDarkMode } = useAppContext();

  return <BlogPostLayout isDarkMode={isDarkMode} post={post} />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const { isDarkMode } = useAppContext();

  let errorMessage = "The blog post you're looking for doesn't exist.";
  let errorTitle = "Post Not Found";

  if (isRouteErrorResponse(error)) {
    if (error.status !== 404) {
      errorMessage = "An unexpected error occurred. Please try again later.";
      errorTitle = "Error";
    }
  } else if (error instanceof Error) {
    errorMessage = "An unexpected error occurred. Please try again later.";
    errorTitle = "Error";
  }

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <main className="mt-32 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4 text-foreground">{errorTitle}</h1>
        <p className="text-foreground">{errorMessage}</p>
      </main>
    </div>
  );
}