"use client";

import { useSyncExternalStore } from "react";

import { DUMMY_CREATOR_CONTENTS, DUMMY_REVISION_THREADS } from "@/data/dummy/creator";
import { ArticleDraft, CreatorContent } from "@/types/RoleDashboard";

// Prototipe Mode Creator sebelum backend tersedia: perubahan hanya tersimpan di browser ini.
const STORAGE_KEY = "belajarautomation-creator-studio";

interface NoteState {
  fixed: boolean;
  reply: string;
}

interface StudioState {
  contents: CreatorContent[];
  notes: Record<string, NoteState>;
}

const INITIAL_STATE: StudioState = { contents: DUMMY_CREATOR_CONTENTS, notes: {} };

let cache: StudioState | null = null;
const listeners = new Set<() => void>();

function read(): StudioState {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (parsed && Array.isArray(parsed.contents)) return { contents: parsed.contents, notes: parsed.notes ?? {} };
  } catch {
    // Data rusak atau penyimpanan tidak tersedia.
  }
  return INITIAL_STATE;
}

function getSnapshot() {
  cache ??= read();
  return cache;
}

function write(state: StudioState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Penyimpanan tidak tersedia; perubahan hanya bertahan di memori.
  }
  cache = state;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Sinkron antar tab.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCreatorStudio() {
  return useSyncExternalStore(subscribe, getSnapshot, () => INITIAL_STATE);
}

const today = () => new Date().toISOString().slice(0, 10);

function updateContent(id: number, changes: Partial<CreatorContent>) {
  const state = getSnapshot();
  write({
    ...state,
    contents: state.contents.map((content) => (content.id === id ? { ...content, ...changes, updatedAt: today() } : content)),
  });
}

export const creatorStudioActions = {
  // Mengembalikan id konten, karena konten baru baru punya id setelah disimpan pertama kali.
  saveDraft(id: number | null, fields: { title: string; category: string; article: ArticleDraft }) {
    if (id !== null) {
      updateContent(id, fields);
      return id;
    }
    const state = getSnapshot();
    const newId = Math.max(0, ...state.contents.map((content) => content.id)) + 1;
    const created: CreatorContent = { id: newId, type: "Artikel", status: "draft", updatedAt: today(), ...fields };
    write({ ...state, contents: [created, ...state.contents] });
    return newId;
  },
  submit(id: number) {
    updateContent(id, { status: "in-review" });
  },
  // Tarik kembali mengembalikan konten menjadi Draf (PRD FR-15).
  withdraw(id: number) {
    updateContent(id, { status: "draft" });
  },
  remove(id: number) {
    const state = getSnapshot();
    write({ ...state, contents: state.contents.filter((content) => content.id !== id) });
  },
  // Konten terbit tetap tayang; perubahannya dibuat sebagai revisi baru (PRD FR-15).
  createRevision(id: number) {
    const state = getSnapshot();
    const source = state.contents.find((content) => content.id === id);
    if (!source) return null;
    const newId = Math.max(0, ...state.contents.map((content) => content.id)) + 1;
    const revision: CreatorContent = {
      ...source,
      id: newId,
      title: `${source.title} (Revisi)`,
      status: "draft",
      updatedAt: today(),
      publicHref: undefined,
    };
    write({ ...state, contents: [revision, ...state.contents] });
    return newId;
  },
  setNoteFixed(noteId: string, fixed: boolean) {
    const state = getSnapshot();
    const note = state.notes[noteId] ?? { fixed: false, reply: "" };
    write({ ...state, notes: { ...state.notes, [noteId]: { ...note, fixed } } });
  },
  setNoteReply(noteId: string, reply: string) {
    const state = getSnapshot();
    const note = state.notes[noteId] ?? { fixed: false, reply: "" };
    write({ ...state, notes: { ...state.notes, [noteId]: { ...note, reply } } });
  },
};

// Catatan revisi per konten yang masih bisa ditangani Creator.
export function getRevisionThread(contentId: number) {
  return DUMMY_REVISION_THREADS.find((thread) => thread.contentId === contentId);
}

export function countFixedNotes(contentId: number, notes: StudioState["notes"]) {
  return (getRevisionThread(contentId)?.notes ?? []).filter((note) => notes[note.id]?.fixed).length;
}
