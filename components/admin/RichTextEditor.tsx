'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import {
  Bold, Italic, UnderlineIcon, List, ListOrdered,
  Heading2, Heading3, Minus, RotateCcw,
} from 'lucide-react'

interface Props {
  name: string
  defaultValue?: string | null
  placeholder?: string
  rows?: number
}

const ToolbarBtn = ({
  onClick, active, title, children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-1.5 rounded transition-colors ${
      active
        ? 'bg-[#041e42] text-white'
        : 'text-[#555] hover:bg-[#f2f3f5] hover:text-[#021523]'
    }`}
  >
    {children}
  </button>
)

export default function RichTextEditor({ name, defaultValue, placeholder, rows = 6 }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: placeholder ?? 'Start typing…' }),
    ],
    content: defaultValue ?? '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[inherit] prose prose-sm max-w-none text-[#021523] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
      },
    },
  })

  // Keep hidden input in sync
  useEffect(() => {
    if (!editor) return
    const el = document.querySelector(`input[data-editor="${name}"]`) as HTMLInputElement | null
    const update = () => { if (el) el.value = editor.getHTML() }
    editor.on('update', update)
    update()
    return () => { editor.off('update', update) }
  }, [editor, name])

  if (!editor) return null

  const minH = `${rows * 1.6}rem`

  return (
    <div className="border border-[#e5e8ec] rounded-lg overflow-hidden focus-within:border-[#041e42] transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-[#e5e8ec] bg-[#f9fafb]">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon size={14} />
        </ToolbarBtn>

        <div className="w-px h-4 bg-[#e5e8ec] mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 size={14} />
        </ToolbarBtn>

        <div className="w-px h-4 bg-[#e5e8ec] mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={14} />
        </ToolbarBtn>

        <div className="w-px h-4 bg-[#e5e8ec] mx-1" />

        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus size={14} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear formatting">
          <RotateCcw size={14} />
        </ToolbarBtn>
      </div>

      {/* Editor */}
      <div className="px-3 py-2.5 bg-white" style={{ minHeight: minH }}>
        <EditorContent editor={editor} />
      </div>

      {/* Hidden input carries HTML value on form submit */}
      <input type="hidden" name={name} data-editor={name} defaultValue={defaultValue ?? ''} />
    </div>
  )
}
