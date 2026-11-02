import { SelectorType } from "@/types/ChallengeDetail";

export type SelectorRun =
  | { ok: true; elements: Element[] }
  | { ok: false; message: string };

// Menjalankan selector tanpa eval, dan hanya elemen di dalam kontainer yang dihitung:
// XPath absolut seperti //button tetap mencari di seluruh dokumen, jadi hasilnya disaring.
export function runSelector(root: Element, type: SelectorType, selector: string): SelectorRun {
  const trimmed = selector.trim();
  if (!trimmed) return { ok: false, message: "Selector masih kosong." };

  try {
    if (type === "css") {
      return { ok: true, elements: [...root.querySelectorAll(trimmed)] };
    }

    const result = document.evaluate(trimmed, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const elements: Element[] = [];
    for (let index = 0; index < result.snapshotLength; index += 1) {
      const node = result.snapshotItem(index);
      if (node instanceof Element && node !== root && root.contains(node)) elements.push(node);
    }
    return { ok: true, elements };
  } catch {
    return {
      ok: false,
      message: `Selector ${type === "css" ? "CSS" : "XPath"} tidak valid. Periksa kembali penulisannya.`,
    };
  }
}
