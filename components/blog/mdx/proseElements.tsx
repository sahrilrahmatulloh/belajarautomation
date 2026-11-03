type Props<T extends keyof React.JSX.IntrinsicElements> = React.ComponentProps<T>;

// Tampilan elemen isi artikel, dipakai halaman publik (MDX) dan pratinjau konten editor.
// Paragraf dan daftar dibatasi sekitar 70 karakter per baris agar nyaman dibaca, sedangkan
// kode, tabel, dan gambar memakai lebar penuh.
export const PROSE_ELEMENTS = {
  h2: (props: Props<"h2">) => <h2 className="mt-10 scroll-mt-4 text-2xl font-bold tracking-tight first:mt-0" {...props} />,
  h3: (props: Props<"h3">) => <h3 className="mt-8 scroll-mt-4 text-xl font-semibold tracking-tight" {...props} />,
  p: (props: Props<"p">) => <p className="my-4 max-w-[37rem] leading-8" {...props} />,
  ul: (props: Props<"ul">) => <ul className="my-4 max-w-[37rem] list-disc space-y-2 pl-6 leading-8" {...props} />,
  ol: (props: Props<"ol">) => <ol className="my-4 max-w-[37rem] list-decimal space-y-2 pl-6 leading-8" {...props} />,
  blockquote: (props: Props<"blockquote">) => (
    <blockquote className="my-6 max-w-[37rem] border-l-4 border-border pl-4 text-muted-foreground" {...props} />
  ),
  code: (props: Props<"code">) => (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />
  ),
  table: (props: Props<"table">) => (
    <div role="group" tabIndex={0} aria-label="Tabel" className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-left text-sm [&_tbody_tr:last-child_td]:border-b-0" {...props} />
    </div>
  ),
  th: (props: Props<"th">) => <th className="border-b border-border bg-muted px-4 py-2.5 font-semibold" {...props} />,
  td: (props: Props<"td">) => <td className="border-b border-border px-4 py-2.5 align-top" {...props} />,
};
