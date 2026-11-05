"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import ListPagination, { pageSlice } from "@/components/common/ListPagination";
import { EditorDialog } from "@/components/creator/studio/EditorDialogs";
import PrototypeNotice from "@/components/creator/studio/PrototypeNotice";
import SearchField from "@/components/filters/SearchField";
import { runContentAction } from "@/lib/content";
import { prepareImage, validateImage } from "@/lib/content/imageUpload";
import { formatContentDate } from "@/lib/content/document";
import { matchesKeyword } from "@/lib/filters";
import { formatRupiah } from "@/lib/format";
import { useCatalogFilters } from "@/lib/useUrlFilters";
import { Product, ProductInput } from "@/types/Commerce";

import AdminList, { AdminColumn } from "./AdminList";
import { useAdminData } from "./useAdminData";

const PAGE_SIZE = 10;
const FILTER_KEYS = ["q", "jenis", "status"] as const;
const selectClass = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-medium dark:bg-card";
const fieldClass = "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-normal dark:bg-card";
export const PRODUCT_KIND_LABELS = { ebook: "eBook", project: "Project" };
const STATUS_LABELS = { draf: "Draf", terbit: "Terbit" };

function ProductForm({ product, userId, onClose }: { product: Product | null; userId: string; onClose: () => void }) {
  const [form, setForm] = useState<ProductInput>({
    kind: product?.kind ?? "ebook",
    title: product?.title ?? "",
    description: product?.description ?? "",
    cover: product?.cover ?? "",
    price: product?.price ?? 0,
    fileName: product?.fileName ?? "",
    status: product?.status ?? "draf",
  });
  const [alasan, setAlasan] = useState("");
  const [error, setError] = useState("");
  const isPriceChanged = Boolean(product && product.price !== form.price);
  const update = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((current) => ({ ...current, [key]: value }));

  const pickCover = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateImage(file);
    setError(problem ?? "");
    if (problem) return;
    try {
      update("cover", await prepareImage(file));
    } catch (reason) {
      setError((reason as Error).message);
    }
  };

  const save = async () => {
    const result = await runContentAction((repository) => repository.saveProduct(userId, product?.id ?? null, form, alasan));
    if (result.ok) onClose();
    else setError(result.message);
  };

  return (
    <EditorDialog title={product ? "Ubah Produk" : "Tambah Produk"} onClose={onClose}>
      <div className="mt-4 space-y-3">
        {!product && (
          <label className="block text-sm font-medium">
            Jenis produk
            <select value={form.kind} onChange={(event) => update("kind", event.target.value as ProductInput["kind"])} className={fieldClass}>
              <option value="ebook">eBook</option>
              <option value="project">Project</option>
            </select>
          </label>
        )}
        <label className="block text-sm font-medium">
          Judul
          <input value={form.title} onChange={(event) => update("title", event.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">
          Deskripsi
          <textarea rows={3} value={form.description} onChange={(event) => update("description", event.target.value)} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">
          Sampul (Simulasi)
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void pickCover(event.target.files?.[0])} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">
          Harga (Rp)
          <input type="number" min={0} value={form.price} onChange={(event) => update("price", Number(event.target.value))} className={fieldClass} />
        </label>
        {isPriceChanged && (
          <label className="block text-sm font-medium">
            Alasan perubahan harga
            <textarea rows={2} value={alasan} onChange={(event) => setAlasan(event.target.value)} className={fieldClass} />
            <span className="mt-1 block text-xs font-normal text-muted-foreground">Perubahan harga tidak mengubah transaksi yang sudah terjadi.</span>
          </label>
        )}
        <label className="block text-sm font-medium">
          File produk (Simulasi)
          <input type="file" onChange={(event) => update("fileName", event.target.files?.[0]?.name ?? form.fileName)} className={fieldClass} />
          <span className="mt-1 block text-xs font-normal text-muted-foreground">{form.fileName ? `Tercatat: ${form.fileName}` : "Belum ada file."} File tidak benar-benar diunggah.</span>
        </label>
        <label className="block text-sm font-medium">
          Status
          <select value={form.status} onChange={(event) => update("status", event.target.value as ProductInput["status"])} className={fieldClass}>
            <option value="draf">Draf</option>
            <option value="terbit">Terbit</option>
          </select>
        </label>
      </div>
      {error && <p role="alert" className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={onClose} className="min-h-10 rounded-xl border border-border px-4 text-sm font-semibold transition-colors hover:bg-accent">Batal</button>
        <button type="button" onClick={() => void save()} className="min-h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">Simpan</button>
      </div>
    </EditorDialog>
  );
}

// Produk Digital (PRD FR-16 F). Katalog publik hanya menampilkan produk Terbit.
export default function ProductsPage() {
  const { userId, data } = useAdminData();
  const { values, search, setSearch, setFilters } = useCatalogFilters(FILTER_KEYS);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<{ product: Product | null } | null>(null);

  if (!data) return <p className="py-10 text-center text-sm text-muted-foreground">Memuat produk...</p>;

  const filtered = data.products.filter(
    (product) => (!values.jenis || product.kind === values.jenis) && (!values.status || product.status === values.status) && matchesKeyword(values.q, product.title)
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));

  const updateFilter = (key: (typeof FILTER_KEYS)[number], value: string) => {
    setFilters({ [key]: value });
    setPage(1);
  };

  const columns: AdminColumn<Product>[] = [
    { header: "Judul", cell: (product) => product.title },
    { header: "Jenis", cell: (product) => PRODUCT_KIND_LABELS[product.kind] },
    { header: "Harga", cell: (product) => <span className="whitespace-nowrap">{formatRupiah(product.price)}</span> },
    { header: "File", cell: (product) => product.fileName || "-" },
    { header: "Status", cell: (product) => STATUS_LABELS[product.status] },
    { header: "Diubah", cell: (product) => <span className="whitespace-nowrap">{formatContentDate(product.updatedAt)}</span> },
    {
      header: "Aksi",
      cell: (product) => (
        <button type="button" aria-label={`Ubah ${product.title}`} onClick={() => setEditing({ product })} className="font-medium text-primary-accent underline-offset-2 hover:underline">Ubah</button>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <PrototypeNotice />

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Produk Digital</h1>
          <p className="mt-1 text-muted-foreground">eBook dan project. Katalog publik hanya menampilkan produk Terbit.</p>
        </div>
        <button type="button" onClick={() => setEditing({ product: null })} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah Produk
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <SearchField
          label="Cari produk"
          value={search}
          placeholder="Cari judul produk..."
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <select aria-label="Filter jenis" value={values.jenis} onChange={(event) => updateFilter("jenis", event.target.value)} className={selectClass}>
          <option value="">Semua jenis</option>
          <option value="ebook">eBook</option>
          <option value="project">Project</option>
        </select>
        <select aria-label="Filter status" value={values.status} onChange={(event) => updateFilter("status", event.target.value)} className={selectClass}>
          <option value="">Semua status</option>
          <option value="draf">Draf</option>
          <option value="terbit">Terbit</option>
        </select>
      </div>

      {filtered.length > 0 ? (
        <>
          <AdminList label="produk" rows={pageSlice(filtered, currentPage, PAGE_SIZE)} columns={columns} rowKey={(product) => product.id} />
          <ListPagination total={filtered.length} page={currentPage} pageSize={PAGE_SIZE} itemLabel="produk" onChange={setPage} />
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center text-sm text-muted-foreground">Tidak ada produk yang cocok.</p>
      )}

      {editing && <ProductForm product={editing.product} userId={userId} onClose={() => setEditing(null)} />}
    </div>
  );
}
