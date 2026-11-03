"use client";

import { useEffect, useState } from "react";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Code, Heading2, Heading3, ImagePlus, Italic, Lightbulb, List, LucideIcon, Redo2, Table, TriangleAlert, Undo2, Video } from "lucide-react";

import { collectVideos, listHeadings, VIDEO_NODE } from "@/lib/content/document";
import { MAX_VIDEOS } from "@/lib/content/rules";
import { ContentNode, ContentVideo } from "@/types/ContentWorkflow";

import { CalloutNodes, EDIT_VIDEO_EVENT, GambarNode, VideoNode } from "./editorNodes";
import { ImageDialog, VideoDialog } from "./EditorDialogs";

const proseClass =
  "min-h-80 rounded-lg border border-input bg-background p-4 text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-card [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-2 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-950 [&_pre]:p-4 [&_pre]:text-slate-100 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-2 [&_th]:text-left [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6";

function ToolbarButton({ label, icon: Icon, isActive, disabled, onClick }: { label: string; icon: LucideIcon; isActive?: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors enabled:hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 ${isActive ? "bg-primary/10 text-primary-accent" : ""}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

// Editor isi konten: isi disimpan sebagai dokumen JSON, bukan HTML (PRD FR-15).
export default function RichTextEditor({
  initial,
  focusAnchor,
  onChange,
}: {
  initial: ContentNode;
  // Id heading atau video yang dituju dari Catatan Revisi.
  focusAnchor: string | null;
  onChange: (body: ContentNode) => void;
}) {
  const [videoDialog, setVideoDialog] = useState<{ video: ContentVideo | null } | null>(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false, underline: false, strike: false }),
      TableKit.configure({ table: { resizable: false } }),
      ...CalloutNodes,
      GambarNode,
      VideoNode,
    ],
    content: initial,
    editorProps: {
      attributes: { role: "textbox", "aria-multiline": "true", "aria-label": "Isi artikel", class: proseClass },
    },
    onUpdate: ({ editor: current }) => onChange(current.getJSON() as ContentNode),
  });

  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;
    const openEdit = (event: Event) => setVideoDialog({ video: (event as CustomEvent<ContentVideo>).detail });
    dom.addEventListener(EDIT_VIDEO_EVENT, openEdit);
    return () => dom.removeEventListener(EDIT_VIDEO_EVENT, openEdit);
  }, [editor]);

  // Melompat ke bagian yang dibahas catatan revisi.
  useEffect(() => {
    if (!editor || !focusAnchor) return;
    const dom = editor.view.dom;
    const headingIndex = listHeadings(editor.getJSON() as ContentNode).findIndex((heading) => heading.id === focusAnchor);
    const target = headingIndex >= 0 ? dom.querySelectorAll("h2, h3")[headingIndex] : dom.querySelector(`[data-video-id="${CSS.escape(focusAnchor)}"]`);
    if (!target) return;
    if (headingIndex >= 0) editor.commands.setTextSelection(editor.view.posAtDOM(target, 0));
    target.scrollIntoView({ block: "center" });
  }, [editor, focusAnchor]);

  if (!editor) return <div className="mt-3 min-h-80 rounded-lg border border-input bg-muted/40" />;

  const videos = collectVideos(editor.getJSON() as ContentNode);
  const chain = () => editor.chain().focus();
  // Disisipkan setelah pilihan, karena blok yang baru dimasukkan tetap terpilih dan akan tertimpa.
  const insertBlock = (block: ContentNode) => chain().insertContentAt(editor.state.selection.to, block).run();

  const saveVideo = (video: ContentVideo) => {
    const editing = videoDialog?.video;
    if (editing) {
      editor.state.doc.descendants((node, position) => {
        if (node.type.name === VIDEO_NODE && node.attrs.id === editing.id) {
          editor.view.dispatch(editor.state.tr.setNodeMarkup(position, undefined, video));
          return false;
        }
        return true;
      });
    } else {
      insertBlock({ type: VIDEO_NODE, attrs: { ...video } });
    }
    setVideoDialog(null);
  };

  return (
    <>
      <div role="toolbar" aria-label="Format isi" className="mt-3 flex flex-wrap gap-1 border-b border-border pb-2">
        <ToolbarButton label="Heading 2" icon={Heading2} isActive={editor.isActive("heading", { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
        <ToolbarButton label="Heading 3" icon={Heading3} isActive={editor.isActive("heading", { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
        <ToolbarButton label="Tebal" icon={Bold} isActive={editor.isActive("bold")} onClick={() => chain().toggleBold().run()} />
        <ToolbarButton label="Miring" icon={Italic} isActive={editor.isActive("italic")} onClick={() => chain().toggleItalic().run()} />
        <ToolbarButton label="Daftar" icon={List} isActive={editor.isActive("bulletList")} onClick={() => chain().toggleBulletList().run()} />
        <ToolbarButton label="Blok kode" icon={Code} isActive={editor.isActive("codeBlock")} onClick={() => chain().toggleCodeBlock({ language: "ts" }).run()} />
        <ToolbarButton label="Kotak Tips" icon={Lightbulb} isActive={editor.isActive("tips")} onClick={() => chain().toggleWrap("tips").run()} />
        <ToolbarButton label="Kotak Peringatan" icon={TriangleAlert} isActive={editor.isActive("peringatan")} onClick={() => chain().toggleWrap("peringatan").run()} />
        <ToolbarButton label="Upload gambar" icon={ImagePlus} onClick={() => setIsImageOpen(true)} />
        <ToolbarButton label="Tabel" icon={Table} isActive={editor.isActive("table")} onClick={() => chain().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()} />
        <ToolbarButton
          label={videos.length >= MAX_VIDEOS ? "Sisipkan video (maksimal 3 video)" : "Sisipkan video"}
          icon={Video}
          disabled={videos.length >= MAX_VIDEOS}
          onClick={() => setVideoDialog({ video: null })}
        />
        <ToolbarButton label="Urungkan" icon={Undo2} disabled={!editor.can().undo()} onClick={() => chain().undo().run()} />
        <ToolbarButton label="Ulangi" icon={Redo2} disabled={!editor.can().redo()} onClick={() => chain().redo().run()} />
      </div>

      <div className="mt-3">
        <EditorContent editor={editor} />
      </div>

      {videoDialog && (
        <VideoDialog
          initial={videoDialog.video}
          usedIds={videos.map((video) => video.id).filter((id) => id !== videoDialog.video?.id)}
          onSave={saveVideo}
          onClose={() => setVideoDialog(null)}
        />
      )}
      {isImageOpen && (
        <ImageDialog
          onSave={(image) => {
            insertBlock({ type: "gambar", attrs: image });
            setIsImageOpen(false);
          }}
          onClose={() => setIsImageOpen(false)}
        />
      )}
    </>
  );
}
