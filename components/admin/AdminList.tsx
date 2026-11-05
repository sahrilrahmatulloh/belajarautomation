"use client";

export interface AdminColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
}

// Daftar Panel Admin: tabel di desktop dan kartu di mobile (PRD FR-16). Kolom pertama menjadi
// judul baris atau judul kartu, dan kolom Aksi tampil tanpa label di kartu.
export default function AdminList<T>({ label, rows, columns, rowKey }: { label: string; rows: T[]; columns: AdminColumn<T>[]; rowKey: (row: T) => string }) {
  const [first, ...rest] = columns;

  return (
    <>
      <div role="group" tabIndex={0} aria-label={`Tabel ${label}`} className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th key={column.header} scope="col" className="px-4 py-2.5 font-medium">{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={rowKey(row)}>
                <th scope="row" className="px-4 py-3 font-medium">{first.cell(row)}</th>
                {rest.map((column) => (
                  <td key={column.header} className="px-4 py-3 text-muted-foreground">{column.cell(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul aria-label={`Daftar ${label}`} className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="rounded-2xl border border-border bg-card p-4 text-sm">
            <p className="font-semibold [overflow-wrap:anywhere]">{first.cell(row)}</p>
            <dl className="mt-2 space-y-1.5">
              {rest.map((column) => (
                <div key={column.header} className="flex flex-wrap justify-between gap-x-3 gap-y-1">
                  <dt className={column.header === "Aksi" ? "sr-only" : "text-muted-foreground"}>{column.header}</dt>
                  <dd className="min-w-0 [overflow-wrap:anywhere]">{column.cell(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
