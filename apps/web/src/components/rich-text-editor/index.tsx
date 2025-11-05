"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Youtube from "@tiptap/extension-youtube";

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}
export default function RichTextEditor({
  content,
  onChange,
  editable,
}: RichTextEditorProps) {
  const isEditable = editable ?? true;

  const editor = useEditor({
    immediatelyRender: false,
    editable: isEditable,
    extensions: [
    Youtube.configure({
      controls: true,
      nocookie: true,
      width: 600,
      height: 300,
      HTMLAttributes: {
          class: "youtube-video",
        },
    }),
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: "tiptap-heading",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "tiptap-paragraph",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-6",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-6",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "leading-7",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "border-l-4 border-primary pl-4 italic my-4",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: "bg-muted p-4 rounded-lg overflow-x-auto my-4",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "my-8 border-border",
          },
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded",
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: isEditable
          ? "min-h-[156px] border rounded-md bg-slate-50 dark:bg-slate-900 py-2 px-3 focus:outline-none prose prose-slate dark:prose-invert max-w-none"
          : "prose prose-slate dark:prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full">
      {isEditable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}