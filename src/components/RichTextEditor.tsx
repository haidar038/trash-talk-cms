// src/components/RichTextEditor.tsx

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorToolbar } from "./EditorToolbar";

interface RichTextEditorProps {
    initialContent: string;
    onChange: (html: string) => void;
    disabled?: boolean;
}

export function RichTextEditor({ initialContent, onChange, disabled = false }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Konfigurasi ekstensi jika perlu
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc pl-6",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal pl-6",
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: "border-l-4 border-primary pl-4 opacity-75",
                    },
                },
            }),
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: "min-h-[250px] w-full rounded-md rounded-t-none border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 prose dark:prose-invert max-w-none",
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
        editable: !disabled,
    });

    return (
        <div className="flex flex-col gap-0">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
