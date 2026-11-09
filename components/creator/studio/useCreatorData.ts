"use client";

import { useContentData } from "@/lib/content";
import { useSession } from "@/lib/session";

// Konten milik Creator yang sedang masuk, beserta catatan dan nama pengguna.
export function useCreatorData() {
  const session = useSession();
  const userId = session?.userId ?? "";

  const data = useContentData(`creator-${userId}`, async (repository) => {
    const [contents, notes, users] = await Promise.all([repository.listContents(), repository.listAllNotes(), repository.listUsers()]);
    const own = contents.filter((content) => content.authorId === userId);
    const ownIds = new Set(own.map((content) => content.id));
    return { contents: own, notes: notes.filter((note) => ownIds.has(note.contentId) && note.released), users };
  });

  return { userId, data };
}

export function userName(users: { id: string; name: string }[], userId: string | null) {
  return users.find((user) => user.id === userId)?.name ?? "-";
}
