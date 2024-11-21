import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Link } from "@remix-run/react"
import type { BlogPost } from "~/routes/blog";

const tagColors = {
  "INSIGHTS": "hsl(var(--chart-1))",
  "LABS": "hsl(var(--chart-2))",
  "RESEARCH": "hsl(var(--chart-3))",
  "PRODUCT": "hsl(var(--chart-4))"
}

interface BlogLayoutComponentProps {
  posts: BlogPost[];
}

export function BlogLayoutComponent({ posts }: BlogLayoutComponentProps) {
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-background pt-16">
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-6">
            <Card className="w-full bg-card border-border rounded-none overflow-hidden">
              <div className="md:flex">
                <div className="md:w-2/3">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <span 
                        className="px-3 py-1 text-xs font-semibold rounded-none border"
                        style={{
                          borderColor: tagColors[featuredPost.tag as keyof typeof tagColors],
                          backgroundColor: `color-mix(in srgb, ${tagColors[featuredPost.tag as keyof typeof tagColors]} 20%, transparent)`,
                          color: tagColors[featuredPost.tag as keyof typeof tagColors]
                        }}
                      >
                        {featuredPost.tag}
                      </span>
                    </div>
                    <CardTitle className="text-2xl text-card-foreground">Featured: {featuredPost.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{featuredPost.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <Link to={`/blog/${featuredPost.id}`}>
                      <Button variant="outline" className="rounded-none w-full sm:w-auto">Read More</Button>
                    </Link>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{featuredPost.createdAt} | {featuredPost.author}</span>
                    </div>
                  </CardFooter>
                  <div className="px-6 pb-4">
                    <p className="text-xs text-muted-foreground">
                      References: {featuredPost.references.map((ref, index) => `[${index + 1}] ${ref}`).join(' ')}
                    </p>
                  </div>
                </div>
                <div className="md:w-1/3 relative h-64 md:h-auto">
                  {/* Image placeholder */}
                  <div className="absolute inset-0 bg-muted"></div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Recent Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">Recent Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPosts.map((post) => (
              <Card key={post.id} className="bg-card border-border hover:border-ring transition-colors duration-200 rounded-none">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <span 
                      className="px-3 py-1 text-xs font-semibold rounded-none border"
                      style={{
                        borderColor: tagColors[post.tag as keyof typeof tagColors],
                        backgroundColor: `color-mix(in srgb, ${tagColors[post.tag as keyof typeof tagColors]} 20%, transparent)`,
                        color: tagColors[post.tag as keyof typeof tagColors]
                      }}
                    >
                      {post.tag}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-card-foreground">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted mb-4 relative">
                    {/* Image placeholder */}
                  </div>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                  <Link to={`/blog/${post.id}`}>
                    <Button variant="outline" className="rounded-none w-full sm:w-auto">Read More</Button>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{post.createdAt} | {post.author}</span>
                  </div>
                </CardFooter>
                <div className="px-6 pb-4">
                  <p className="text-xs text-muted-foreground">
                    References: {post.references.map((ref, index) => `[${index + 1}] ${ref}`).join(' ')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}