// File: app/types/mdxeditor.d.ts

declare module '@mdxeditor/editor' {
    import React from 'react';
  
    export interface MDXEditorProps {
      className: string;
      markdown: string;
      onChange: (markdown: string) => void;
      plugins?: any[];
      contentEditableClassName?: string;
    }
  
    export const MDXEditor: React.FC<MDXEditorProps>;
  
    export interface SandpackConfig {
      defaultPreset: string;
      presets: SandpackPreset[];
    }
  
    export interface SandpackPreset {
      label: string;
      name: string;
      meta: string;
      sandpackTemplate: string;
      sandpackTheme: string;
      snippetFileName: string;
      snippetLanguage: string;
      initialSnippetContent: string;
    }
  
    export function codeBlockPlugin(options?: { defaultCodeBlockLanguage?: string }): any;
    export function sandpackPlugin(options: { sandpackConfig: SandpackConfig }): any;
    export function codeMirrorPlugin(options: { codeBlockLanguages: Record<string, string> }): any;
    export function headingsPlugin(): any;
    export function listsPlugin(): any;
    export function quotePlugin(): any;
    export function thematicBreakPlugin(): any;
    export function markdownShortcutPlugin(): any;
    export function tablePlugin(): any;
    export function imagePlugin(): any;
    export function linkPlugin(): any;
    export function linkDialogPlugin(): any;
    export function frontmatterPlugin(): any;
    export function directivesPlugin(options: any): any;
    export function diffSourcePlugin(options: { viewMode: string }): any;
    export function toolbarPlugin(options: { toolbarContents: () => React.ReactNode }): any;
  
    export const UndoRedo: React.FC;
    export const BoldItalicUnderlineToggles: React.FC;
    export const CodeToggle: React.FC;
    export const CreateLink: React.FC;
    export const InsertCodeBlock: React.FC;
    export const InsertSandpack: React.FC;
    export const InsertTable: React.FC;
    export const InsertThematicBreak: React.FC;
    export const ListsToggle: React.FC;
    export const BlockTypeSelect: React.FC;
    export const InsertImage: React.FC;
    export const ChangeCodeMirrorLanguage: React.FC;
    export const ShowSandpackInfo: React.FC;
  
    export const DiffSourceToggleWrapper: React.FC<{ children: React.ReactNode }>;
    export const ConditionalContents: React.FC<{
      options: Array<{
        when?: (editor: any) => boolean;
        contents: () => React.ReactNode;
      } | {
        fallback: () => React.ReactNode;
      }>;
    }>;
  
    export function useEditorContext(): { editorContext: any };
  }