// File: app/components/MDXEditorComponent.tsx

import React, { type FC } from 'react';
import {
  MDXEditor,
  codeBlockPlugin,
  sandpackPlugin,
  codeMirrorPlugin,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  imagePlugin,
  linkPlugin,
  linkDialogPlugin,
  frontmatterPlugin,
  directivesPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  ShowSandpackInfo,
  InsertCodeBlock,
  InsertSandpack,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  BlockTypeSelect,
  CodeToggle,
  DiffSourceToggleWrapper,
  type SandpackConfig
} from '@mdxeditor/editor';

// Make sure to import the styles
import '@mdxeditor/editor/style.css';

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: 'react',
  presets: [
    {
      label: 'React',
      name: 'react',
      meta: 'live react',
      sandpackTemplate: 'react',
      sandpackTheme: 'light',
      snippetFileName: '/App.js',
      snippetLanguage: 'jsx',
      initialSnippetContent: defaultSnippetContent
    },
  ]
};

interface MDXEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

export const MDXEditorComponent: FC<MDXEditorProps> = ({ markdown, onChange }) => {
  return (
    <MDXEditor
      className="mdx-editor-custom"
      markdown={markdown}
      onChange={onChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js' }),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig }),
        codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', html: 'HTML', python: 'Python' } }),
        tablePlugin(),
        imagePlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        frontmatterPlugin(),
        directivesPlugin({}),
        diffSourcePlugin({ viewMode: 'rich-text' }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <ConditionalContents
                options={[
                  { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                  { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                  { fallback: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <CreateLink />
                      <InsertCodeBlock />
                      <InsertSandpack />
                      <InsertImage />
                      <InsertTable />
                      <InsertThematicBreak />
                      <BlockTypeSelect />
                      <ListsToggle />
                    </>
                  )}
                ]}
              />
            </DiffSourceToggleWrapper>
          )
        })
      ]}
    />
  );
};