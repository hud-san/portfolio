import { useState, useRef } from 'react';
import { type ActionFunction, type LinksFunction } from "@remix-run/node";
import { useActionData, Form } from '@remix-run/react';
import { db } from '~/lib/prisma';
import { useAppContext } from '~/root';
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Bold, Italic, List, ListOrdered, Quote, Code, Image, Link } from 'lucide-react';
import type { Components } from 'react-markdown'

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" },
];

interface ActionData {
  error?: string;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title');
  const content = formData.get('content');
  const excerpt = formData.get('excerpt');
  const author = formData.get('author');
  const date = formData.get('date');
  const tag = formData.get('tag');
  const references = formData.get('references');

  if (
    typeof title !== 'string' ||
    typeof content !== 'string' ||
    typeof excerpt !== 'string' ||
    typeof author !== 'string' ||
    typeof date !== 'string' ||
    typeof tag !== 'string' ||
    typeof references !== 'string'
  ) {
    return new Response(JSON.stringify({ error: 'Invalid form data' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!title || !content || !excerpt || !author || !date || !tag) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const post = await db.post.create({
      data: {
        title,
        content,
        excerpt,
        author,
        date: new Date(date),
        tag,
        references: references.split(',').map(ref => ref.trim()),
      },
    });

    return new Response(JSON.stringify({ id: post.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return new Response(JSON.stringify({ error: 'Failed to create post' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export default function BlogCreate() {
  const { isDarkMode } = useAppContext();
  const actionData = useActionData<ActionData>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState('');
  const [references, setReferences] = useState('');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (start: string, end: string = '') => {
    if (contentRef.current) {
      const textarea = contentRef.current;
      const selectionStart = textarea.selectionStart;
      const selectionEnd = textarea.selectionEnd;
      const selectedText = content.substring(selectionStart, selectionEnd);
      const replacement = start + selectedText + end;
      const newContent = content.substring(0, selectionStart) + replacement + content.substring(selectionEnd);
      setContent(newContent);
      
      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(selectionStart + start.length, selectionEnd + start.length);
      }, 0);
    }
  };

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
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Create New Blog Post</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form method="post" className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                name="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="tag">Tag</Label>
              <Select name="tag" value={tag} onValueChange={setTag} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Content (Markdown)</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                <Button type="button" variant="outline" size="icon" onClick={() => insertMarkdown('**', '**')}><Bold className="h-4 w-4" /></Button>
                <Button type="button" variant="outline" size="icon" onClick={() => insertMarkdown('*', '*')}><Italic className="h-4 w-4" /></Button>
                <Button type="button" variant="outline" size="icon" onClick={() => insertMarkdown('\n- ')}><List className="h-4 w-4" /></Button>
                <Button type="button" variant="outline" size="icon" onClick={() => insertMarkdown('\n1. ')}><ListOrdered className="h-4 w-4" /></Button>
                <Button type="button" variant="outline" size="icon" onClick={() => insertMarkdown('> ')}><Quote className="h-4 w-4" /></Button>
                <Button type="button" variant="outline" size="icon" onClick={() => insertMarkdown('`', '`')}><Code className="h-4 w-4" /></Button>
                <Button type="button" variant="outline" size="icon" onClick={() => insertMarkdown('![Alt text](', ')')}><Image className="h-4 w-4" /></Button>
                <Button type="button" variant="outline" size="icon" onClick={() => insertMarkdown('[', '](https://)')}><Link className="h-4 w-4" /></Button>
              </div>
              <Textarea
                id="content"
                name="content"
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                required
              />
            </div>
            <div>
              <Label htmlFor="references">References (comma-separated)</Label>
              <Input
                id="references"
                name="references"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
              />
            </div>
            <Button type="submit">Create Post</Button>
            {actionData?.error && (
              <p className="text-red-500">{actionData.error}</p>
            )}
          </Form>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Preview</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h1>{title}</h1>
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={components}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}