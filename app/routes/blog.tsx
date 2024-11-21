import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/lib/prisma";
import { BlogLayoutComponent } from "~/components/blog-layout";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  createdAt: string;
  tag: string;
  references: string[];
}

export const loader: LoaderFunction = async () => {
  const posts = await db.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 7, // 1 featured + 6 recent posts
  });

  return json(posts.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString().split('T')[0], // Format date as YYYY-MM-DD
  })));
};

export default function Blog() {
  const posts = useLoaderData<typeof loader>();
  return <BlogLayoutComponent posts={posts} />;
}