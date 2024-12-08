// app/routes/blog.tsx
import { MetaFunction, useLoaderData, useNavigation } from "@remix-run/react";
import { BlogLayoutComponent } from '~/components/blog-layout';
import PageLayout from '~/components/page-layout';
import { db } from "~/lib/prisma";
import { Post } from "~/types/types";
import { formatDate } from "~/lib/date";
import { useState, useEffect } from "react";

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
       content: post.content.substring(0, 150) + '...'
     }))
   });
 } catch (error) {
   console.error("Error fetching posts:", error);
   return Response.json({ posts: [] });
 }
}

export default function Blog() {
 const { posts } = useLoaderData<{ posts: Post[] }>();
 const navigation = useNavigation();
 const [isLoading, setIsLoading] = useState(false);
 
 useEffect(() => {
   let timer: NodeJS.Timeout;
   
   if (navigation.state === "loading") {
     timer = setTimeout(() => {
       setIsLoading(true);
     }, 100);
   } else if (isLoading) {
     timer = setTimeout(() => {
       setIsLoading(false);
     }, 500);
   }

   return () => {
     if (timer) clearTimeout(timer);
   };
 }, [navigation.state, isLoading]);

 return (
   <PageLayout>
     <div className={`w-full bg-background transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
       <BlogLayoutComponent posts={posts || []} />
     </div>
   </PageLayout>
 );
}