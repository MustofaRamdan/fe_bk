"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { useEffect } from "react"

interface EditorProps {
  onChange: (html: string) => void
  initialValue?: string
}

export default function Editor({ onChange, initialValue = "" }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image
    ],
    content: initialValue || "<p>Tulis artikel...</p>", // ✅ Gunakan initialValue
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  // ✅ Update content ketika initialValue berubah (untuk edit)
  useEffect(() => {
    if (editor && initialValue && editor.getHTML() !== initialValue) {
      editor.commands.setContent(initialValue)
    }
  }, [editor, initialValue])

  if (!editor) return null

  const uploadImage = async (file: File) => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`${api}/api/upload`, {
      method: "POST",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: formData
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Upload gagal: ${errText}`)
    }

    const data = await res.json()
    return data.url?.startsWith("http") ? data.url : `${api}${data.url}`
  }

  return (
    <div className="editor-wrapper">

      {/* TOOLBAR */}
      <div className="toolbar">

        {/* Paragraph */}
        <button
          type="button"
          className={editor.isActive("paragraph") ? "active" : ""}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </button>

        {/* Bold */}
        <button
          type="button"
          className={editor.isActive("bold") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          className={editor.isActive("italic") ? "active" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>

        <span className="divider" />

        {/* 📷 Upload Image */}
        <label className="camera-btn">
          📷
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={async (e: any) => {
              const file = e.target.files[0]
              if (!file) return

              const url = await uploadImage(file)
              editor.chain().focus().setImage({ src: url }).run()

              e.target.value = ""
            }}
          />
        </label>

      </div>

      <EditorContent editor={editor} className="editor-content" />

    </div>
  )
}