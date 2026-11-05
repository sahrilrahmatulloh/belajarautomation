import { JetBrains_Mono } from "next/font/google";

import CopyCodeButton from "./CopyCodeButton";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], display: "swap" });

interface CodeFrameProps {
  code: string;
  language: string;
  // HTML hasil shiki. Kosong selama penyorotan di browser belum selesai.
  html?: string;
}

// Blok kode selalu berlatar gelap, di mode terang maupun gelap. Nomor baris memakai CSS
// counter agar tidak ikut tersalin saat teks kode dipilih.
export default function CodeFrame({ code, language, html }: CodeFrameProps) {
  const groupClass = `overflow-x-auto py-3 text-sm leading-6 [counter-reset:line] [&_.line]:[counter-increment:line] [&_.line]:before:mr-5 [&_.line]:before:inline-block [&_.line]:before:w-5 [&_.line]:before:text-right [&_.line]:before:text-slate-400 [&_.line]:before:[content:counter(line)] [&_code]:[font-family:inherit] [&_pre]:[font-family:inherit] [&_pre]:w-fit [&_pre]:min-w-full [&_pre]:!bg-transparent [&_pre]:px-4 ${jetBrainsMono.className}`;

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 text-slate-100">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
        <span className={`text-xs font-semibold ${jetBrainsMono.className}`}>{language}</span>
        <CopyCodeButton code={code} />
      </div>

      {html ? (
        <div role="group" tabIndex={0} aria-label={`Kode ${language}`} className={groupClass} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div role="group" tabIndex={0} aria-label={`Kode ${language}`} className={groupClass}>
          <pre><code>{code}</code></pre>
        </div>
      )}
    </div>
  );
}
