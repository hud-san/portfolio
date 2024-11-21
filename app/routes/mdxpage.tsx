import React, { useState } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { MDXEditorComponent } from '../components/mdxeditor';

export const loader = async () => {
  const initialMarkdown = '';

  return json({ initialMarkdown });
};

export default function MDXPage() {
  const { initialMarkdown } = useLoaderData<typeof loader>();
  const [markdown, setMarkdown] = useState(initialMarkdown);

  const handleChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
    console.log('Markdown updated:', newMarkdown);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">MDX Editor</h1>
      <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
        <MDXEditorComponent
          markdown={markdown}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}