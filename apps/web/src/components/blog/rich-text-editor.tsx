'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
} from 'lucide-react';
// 1. Import the singular 'Toggle' component
import { Toggle } from '@/components/ui/toggle';
import { useEffect } from 'react';

// 1. The Toolbar component
function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) {
    return null;
  }

  return (
    // 2. Replace 'ToggleGroup' with a simple 'div'
    <div className="mb-2 flex flex-wrap items-center gap-1">
      {/* 3. Replace 'ToggleGroupItem' with 'Toggle' */}
      <Toggle
        size="sm"
        value="bold"
        aria-label="Toggle bold"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        value="italic"
        aria-label="Toggle italic"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        value="strike"
        aria-label="Toggle strikethrough"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        value="code"
        aria-label="Toggle code"
        pressed={editor.isActive('code')}
        onPressedChange={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        value="bulletList"
        aria-label="Toggle bullet list"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        value="orderedList"
        aria-label="Toggle ordered list"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        value="blockquote"
        aria-label="Toggle blockquote"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

// 2. The main RichTextEditor component
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function RichTextEditor({
  value,
  onChange,
  onBlur,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    // Do not set content here directly
    // content: value,
    
    // --- THIS IS THE FIX ---
    // This tells Tiptap not to render on the server.
    immediatelyRender: false,
    // -----------------------

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      onBlur();
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-slate dark:prose-invert min-h-[200px] max-w-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      },
    },
  });

  // A secondary fix to safely set initial content
  // This ensures the content is loaded only on the client
  useEffect(() => {
    if (editor && !editor.isDestroyed && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

