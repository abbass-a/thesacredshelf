import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextDirection from 'tiptap-text-direction';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextAlign } from '@tiptap/extension-text-align';
import UnderlineExtension from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { LineHeight } from '../tiptap-extensions/LineHeight';
import {
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Underline as UnderlineIcon,
  Undo,
  Redo,
  Baseline,
  Languages
} from 'lucide-react';
import React, { useCallback, useEffect } from 'react';

// Toolbar Component
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const toggleDirection = useCallback(() => {
    if (editor.isActive({ dir: 'rtl' })) {
      editor.chain().focus().setTextDirection('ltr').run();
    } else {
      editor.chain().focus().setTextDirection('rtl').run();
    }
  }, [editor]);

  const fontFamilies = [
    { label: 'Inter', value: 'Inter' },
    { label: 'Nastaliq (Urdu)', value: 'var(--font-noto-nastaliq), "Noto Nastaliq Urdu", serif' },
    { label: 'Jameel Noori', value: '"Jameel Noori Nastaleeq", serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS, Comic Sans' },
  ];

  const lineHeights = [
    { label: 'Normal', value: 'normal' },
    { label: '1', value: '1' },
    { label: '1.5', value: '1.5' },
    { label: '2', value: '2' },
  ];

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 p-2 mb-0 bg-white border-b border-gray-200 rounded-t-md shadow-sm">
      {/* Font Family Dropdown */}
      <div className="flex items-center gap-1">
        <select
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={editor.getAttributes('textStyle').fontFamily || ''}
        >
          <option value="">Default Font</option>
          {fontFamilies.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Color Picker */}
      <div className="flex items-center gap-1">
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-transparent"
          title="Text Color"
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Formatting buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run() }}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('left').run() }}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Align Left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('center').run() }}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Align Center"
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('right').run() }}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Align Right"
        >
          <AlignRight size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign('justify').run() }}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Justify"
        >
          <AlignJustify size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Line Height */}
      <div className="flex items-center gap-1">
        <Baseline size={18} className="text-gray-500 mr-1" />
        <select
          onChange={(e) => {
            if (e.target.value === 'normal') {
               editor.chain().focus().unsetLineHeight().run();
            } else {
               editor.chain().focus().setLineHeight(e.target.value).run();
            }
          }}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={editor.getAttributes('textStyle').lineHeight || 'normal'}
        >
          {lineHeights.map((lh) => (
            <option key={lh.value} value={lh.value}>
              {lh.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Direction */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.preventDefault(); toggleDirection() }}
          className={`flex items-center gap-1 p-1.5 px-3 rounded text-sm font-medium hover:bg-gray-100 ${editor.isActive({ dir: 'rtl' }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Toggle Text Direction"
        >
          <Languages size={18} />
          {editor.isActive({ dir: 'rtl' }) ? 'RTL' : 'LTR'}
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

       {/* Headings */}
       <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run() }}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run() }}
          className={`p-1.5 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run() }}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run() }}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>
    </div>
  );
};

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder = 'Start typing...' }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextDirection.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LineHeight,
      UnderlineExtension,
      Color,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] p-4 bg-gray-50 border-t-0 rounded-b-md [&_strong]:text-inherit [&_b]:text-inherit',
      },
    },
  });

  // Update content when value changes externally (e.g. from a form reset or default value load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col w-full overflow-hidden border border-gray-300 rounded-md shadow-sm bg-white text-gray-900">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
};

export default RichTextEditor;
