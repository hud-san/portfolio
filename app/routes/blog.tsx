import { MetaFunction, useLoaderData } from "@remix-run/react";
import { BlogLayoutComponent } from '~/components/blog-layout';
import PageLayout from '~/components/page-layout';
import { db } from "~/lib/prisma";
import { Post } from "~/types/types";
import { formatDate } from "~/lib/date";

export const meta: MetaFunction = () => {
  return [
    { title: "BLOG" },
    { name: "description", content: "HUDSON A. A PUBLIC ARCHIVE TO DOCUMENT MY INTERESTS, WORK AND PASSIONS." },
  ];
};

export async function loader() {
  try {
    const posts = await db.post.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        excerpt: true,
        author: true,
        date: true,
        tag: true,
        references: true
      },
    });

    return Response.json({
      posts: posts.map(post => ({
        ...post,
        createdAt: formatDate(post.createdAt),
        updatedAt: formatDate(post.updatedAt),
        date: formatDate(post.date),
        content: post.content.substring(0, 150) + '...' // Truncate content for preview
      }))
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ posts: [] });
  }
}

export default function Blog() {
  const { posts } = useLoaderData<{ posts: Post[] }>();

  return (
    <PageLayout>
      <div className="w-full bg-background">
        <BlogLayoutComponent posts={posts || []} />
      </div>
    </PageLayout>
  );
}