import VideoReferensi from "@/components/content/VideoReferensi";
import { DraftVideo } from "@/types/RoleDashboard";

// Pratinjau sederhana isi draf di browser. Versi setelah backend memakai tampilan halaman
// publik yang sama (PRD FR-15).
function renderBlocks(body: string) {
  const blocks = body.replace(/\r\n/g, "\n").split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return blocks.map((block, index) => {
    if (block.startsWith("```")) {
      const code = block.replace(/^```\w*\n?/, "").replace(/\n?```$/, "");
      return <pre key={index} tabIndex={0} className="my-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">{code}</pre>;
    }
    if (block.startsWith("### ")) return <h4 key={index} className="mt-6 text-lg font-semibold">{block.slice(4)}</h4>;
    if (block.startsWith("## ")) return <h3 key={index} className="mt-8 text-xl font-bold">{block.slice(3)}</h3>;
    if (/^- /m.test(block)) {
      return (
        <ul key={index} className="my-3 list-disc space-y-1 pl-6">
          {block.split("\n").map((item) => <li key={item}>{item.replace(/^- /, "")}</li>)}
        </ul>
      );
    }
    const callout = block.match(/^<(Tips|Peringatan)>\s*([\s\S]*?)\s*<\/\1>$/);
    if (callout) {
      const isTips = callout[1] === "Tips";
      return (
        <aside key={index} className={`my-4 rounded-xl border p-4 text-sm leading-6 ${isTips ? "border-blue-500/30 bg-blue-500/10" : "border-destructive/40 bg-destructive/10"}`}>
          <p className="font-semibold">{isTips ? "Tips" : "Peringatan"}</p>
          {callout[2]}
        </aside>
      );
    }
    const image = block.match(/^!\[(.*)\]\((.*)\)$/);
    if (image) {
      return (
        <p key={index} className="my-4 rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          Gambar: {image[1]} ({image[2]})
        </p>
      );
    }
    return <p key={index} className="my-3 leading-7">{block}</p>;
  });
}

export default function ArticlePreview({ title, body, videos }: { title: string; body: string; videos: DraftVideo[] }) {
  return (
    <article className="min-w-0">
      <h2 className="text-2xl font-bold tracking-tight">{title || "Tanpa judul"}</h2>
      {body.trim() ? renderBlocks(body) : <p className="mt-3 text-sm text-muted-foreground">Isi konten masih kosong.</p>}
      {videos.length > 0 && (
        <section className="mt-8">
          <h3 className="text-lg font-bold">Referensi Video</h3>
          {videos.map((video) => (
            <VideoReferensi
              key={video.id}
              id={video.id}
              judul={video.title}
              channel={video.channel}
              durasi={video.duration}
              bahasa={video.language}
            />
          ))}
        </section>
      )}
    </article>
  );
}
