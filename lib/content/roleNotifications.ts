import { ContentItem, StatusEvent } from "@/types/ContentWorkflow";
import { Notification } from "@/types/Notification";
import { UserRole } from "@/types/Role";

// Notifikasi grup Khusus role dari riwayat status (PRD 4.4 dan FR-15). Id-nya berasal dari
// peristiwa, jadi status dibaca tetap tersimpan walaupun daftarnya dibuat ulang.
function build(event: StatusEvent, content: ContentItem, role: UserRole, title: string, body: string, href: string): Notification {
  return { id: `peran-${role}-${event.id}`, group: "role", role, title, body, href, createdAt: event.at, read: false };
}

export function buildRoleNotifications(role: UserRole, userId: string, events: StatusEvent[], contents: ContentItem[]) {
  const notifications: Notification[] = [];

  for (const event of events) {
    const content = contents.find((item) => item.id === event.contentId);
    if (!content) continue;
    const { judul, id } = content;

    if (role === "creator" && content.authorId === userId) {
      if (event.action === "minta-revisi") notifications.push(build(event, content, role, "Konten perlu revisi", `Reviewer memberi catatan pada ${judul}.`, `/creator/revisi/${id}`));
      if (event.action === "setujui") notifications.push(build(event, content, role, "Konten disetujui", `${judul} sudah disetujui dan menunggu diterbitkan Admin.`, `/creator/konten/${id}`));
      if (event.action === "terbitkan") notifications.push(build(event, content, role, "Konten diterbitkan", `${judul} sudah terbit.`, `/creator/konten/${id}`));
      if (event.action === "tarik-website") notifications.push(build(event, content, role, "Konten ditarik dari website", `${judul} ditarik. Alasan: ${event.alasan ?? "-"}`, `/creator/revisi/${id}`));
    }

    if (role === "reviewer") {
      if (event.action === "tugaskan" && event.targetUserId === userId) notifications.push(build(event, content, role, "Konten ditugaskan kepadamu", `${judul} menunggu review darimu.`, `/reviewer/review/${id}`));
      if (event.action === "kirim-ulang" && content.reviewerId === userId) notifications.push(build(event, content, role, "Kiriman ulang", `${judul} dikirim ulang oleh Creator.`, `/reviewer/review/${id}`));
    }

    if (role === "admin" && event.action === "setujui" && content.status === "disetujui") {
      notifications.push(build(event, content, role, "Konten siap diterbitkan", `${judul} sudah disetujui Reviewer.`, `/admin/konten?status=disetujui`));
    }
  }

  return notifications;
}
