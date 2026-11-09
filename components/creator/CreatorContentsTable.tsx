import ContentStatusBadge from "@/components/roles/ContentStatusBadge";
import { formatContentDate, KIND_LABELS } from "@/lib/content/document";
import { ContentItem } from "@/types/ContentWorkflow";

export default function CreatorContentsTable({ contents }: { contents: ContentItem[] }) {
  return (
    <div role="group" tabIndex={0} aria-label="Tabel konten" className="relative -mx-4 overflow-x-auto sm:-mx-5">
      <table className="w-full min-w-[560px] text-left text-sm">
        <caption className="sr-only">Daftar konten milik creator beserta status penerbitannya</caption>
        <thead className="border-y border-border bg-muted/40 text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Judul</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Jenis</th>
            <th scope="col" className="px-3 py-2.5 font-medium">Status</th>
            <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Diperbarui</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {contents.map((content) => (
            <tr key={content.id}>
              <th scope="row" className="px-4 py-3 font-medium sm:px-5">{content.judul || "Tanpa judul"}</th>
              <td className="px-3 py-3 text-muted-foreground">{KIND_LABELS[content.type]}</td>
              <td className="px-3 py-3">
                <ContentStatusBadge status={content.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted-foreground sm:px-5">
                {formatContentDate(content.updatedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
