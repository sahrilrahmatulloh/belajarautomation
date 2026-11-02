// Memastikan riwayat aktivitas dummy (data/dummy/activity.ts) konsisten dengan katalog,
// challenge, achievement, rank, dan riwayat belajar, sehingga statistik di dashboard,
// profil, dan leaderboard tidak saling bertentangan. Gagal (exit 1) bila tidak.
// Jalankan: npm run check:activity (otomatis sebelum npm run build).
import { readFileSync } from "node:fs";

const read = (file) => readFileSync(file, "utf8");
const slugify = (text) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const XP = Object.fromEntries(
  [...read("data/xp.ts").matchAll(/export const (XP_PER_\w+) = (\d+);/g)].map(([, name, value]) => [name, Number(value)])
);

const courses = new Map(
  read("data/courses.ts")
    .split(/\r?\n  \{/)
    .slice(1)
    .map((block) => [
      block.match(/slug:\s*"([^"]+)"/)?.[1],
      {
        title: block.match(/title:\s*"([^"]+)"/)?.[1],
        available: /availability:\s*"available"/.test(block),
        lessons: Number(block.match(/lessons:\s*(\d+)/)?.[1] ?? 0),
      },
    ])
);

// Urutan lesson per course, dari detail course.
const lessonsByCourse = new Map();
for (const block of read("data/courseDetails.ts").split(/courseSlug:\s*"/).slice(1)) {
  const lessons = [];
  const pattern = /slug:\s*"([^"]+)",\s*title:\s*"([^"]+)"|\[\s*"([^"]+)",\s*\d+\s*\]/g;
  for (const [, slug, title, tupleTitle] of block.matchAll(pattern)) {
    lessons.push(slug ? { slug, title } : { slug: slugify(tupleTitle), title: tupleTitle });
  }
  lessonsByCourse.set(block.slice(0, block.indexOf('"')), lessons);
}

const challenges = new Map(
  read("data/challenges.ts")
    .split(/\r?\n  \{/)
    .slice(1)
    .map((block) => [block.match(/slug:\s*"([^"]+)"/)?.[1], block.match(/title:\s*"([^"]+)"/)?.[1]])
);

const achievements = new Map(
  [...read("data/achievements.ts").matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)"/g)].map(([, id, name]) => [id, name])
);

const ranks = [...read("data/ranks.ts").matchAll(/name:\s*"([^"]+)",\s*minXp:\s*(\d+)/g)].map(([, name, minXp]) => ({
  name,
  minXp: Number(minXp),
}));

// Setiap entri ditulis satu baris: helper("teks", ..., daysAgo, "HH:mm").
const source = read("data/dummy/activity.ts");
const list = source.slice(source.indexOf("export const DUMMY_ACTIVITY"));
const entries = [
  ...list.matchAll(/^\s*(lesson|courseComplete|quiz|challenge|achievement|rankUp)\((.+),\s*(\d+),\s*"([^"]*)"\),?\s*$/gm),
].map(([, kind, args, daysAgo, time]) => ({
  kind,
  strings: [...args.matchAll(/"([^"]*)"/g)].map(([, value]) => value),
  daysAgo: Number(daysAgo),
  time,
}));

const problems = [];
const label = (entry) => `${entry.kind}(${entry.strings.join(", ")})`;

if (entries.length < 30 || entries.length > 40) {
  problems.push(`jumlah entri ${entries.length}, seharusnya 30–40`);
}

let xp = 0;
const lessonsDone = new Map();
const seen = new Set();

entries.forEach((entry, index) => {
  const previous = entries[index - 1];
  if (entry.daysAgo > 29) problems.push(`${label(entry)}: daysAgo harus 0–29`);
  if (!/^\d{2}:\d{2}$/.test(entry.time)) problems.push(`${label(entry)}: jam tidak valid`);
  if (
    previous &&
    (entry.daysAgo > previous.daysAgo ||
      (entry.daysAgo === previous.daysAgo && entry.time <= previous.time))
  ) {
    problems.push(`${label(entry)}: urutan harus dari terlama ke terbaru`);
  }

  // XP hanya diberikan saat aktivitas diselesaikan pertama kali.
  const key = `${entry.kind}:${entry.strings.join(":")}`;
  if (seen.has(key)) problems.push(`${label(entry)}: duplikat`);
  seen.add(key);

  const before = xp;
  if (entry.kind === "lesson") {
    const [courseSlug, lessonSlug, title] = entry.strings;
    const done = lessonsDone.get(courseSlug) ?? [];
    const expected = lessonsByCourse.get(courseSlug)?.[done.length];
    if (!courses.get(courseSlug)?.available) problems.push(`${label(entry)}: course tidak tersedia`);
    if (expected?.slug !== lessonSlug || expected?.title !== title) {
      problems.push(`${label(entry)}: seharusnya lesson ke-${done.length + 1} "${expected?.title}"`);
    }
    lessonsDone.set(courseSlug, [...done, entry]);
    xp += XP.XP_PER_LESSON;
  } else if (entry.kind === "courseComplete") {
    const [courseSlug, title] = entry.strings;
    const course = courses.get(courseSlug);
    if (course?.title !== title) problems.push(`${label(entry)}: judul seharusnya "${course?.title}"`);
    if ((lessonsDone.get(courseSlug) ?? []).length !== course?.lessons) {
      problems.push(`${label(entry)}: belum semua lesson selesai`);
    }
    xp += XP.XP_PER_COURSE_COMPLETION;
  } else if (entry.kind === "quiz") {
    const [courseSlug, title] = entry.strings;
    if (courses.get(courseSlug)?.title !== title) problems.push(`${label(entry)}: judul course tidak cocok`);
    xp += XP.XP_PER_QUIZ;
  } else if (entry.kind === "challenge") {
    const [slug, title] = entry.strings;
    if (challenges.get(slug) !== title) problems.push(`${label(entry)}: judul seharusnya "${challenges.get(slug)}"`);
    xp += XP.XP_PER_CHALLENGE;
  } else if (entry.kind === "achievement") {
    const [id, name] = entry.strings;
    if (achievements.get(id) !== name) problems.push(`${label(entry)}: achievement seharusnya "${achievements.get(id)}"`);
  } else {
    const rank = ranks.find((item) => item.name === entry.strings[0]);
    if (!rank || before < rank.minXp) problems.push(`${label(entry)}: XP ${before} belum mencapai rank ini`);
  }

  // Setiap kali XP melewati batas rank, entri berikutnya harus kenaikan rank tersebut.
  const crossed = ranks.find((rank) => before < rank.minXp && xp >= rank.minXp);
  const next = entries[index + 1];
  if (crossed && !(next?.kind === "rankUp" && next.strings[0] === crossed.name)) {
    problems.push(`${label(entry)}: XP melewati ${crossed.minXp}, harus diikuti rankUp("${crossed.name}")`);
  }
});

// Riwayat belajar (statistik "Materi Selesai" dan kartu Lanjutkan Belajar).
const progress = [
  ...read("data/dummy/learningProgress.ts").matchAll(
    /courseSlug:\s*"([^"]+)",[\s\S]*?completedLessons:\s*(\d+),\s*(?:\/\/[^\n]*\n\s*)?lastOpenedDaysAgo:\s*(\d+)/g
  ),
];
if (progress.length === 0) problems.push("riwayat belajar tidak terbaca; periksa format file");
for (const [, courseSlug, completed, lastOpened] of progress) {
  const done = lessonsDone.get(courseSlug) ?? [];
  if (done.length !== Number(completed)) {
    problems.push(`${courseSlug}: riwayat belajar ${completed} lesson, aktivitas ${done.length} lesson`);
  }
  if (done.at(-1)?.daysAgo !== Number(lastOpened)) {
    problems.push(`${courseSlug}: lastOpenedDaysAgo ${lastOpened}, lesson terakhir di aktivitas ${done.at(-1)?.daysAgo}`);
  }
}
for (const courseSlug of lessonsDone.keys()) {
  if (!progress.some(([, slug]) => slug === courseSlug)) {
    problems.push(`${courseSlug}: ada di aktivitas tetapi tidak ada di riwayat belajar`);
  }
}

if (problems.length > 0) {
  console.error(`Masalah riwayat aktivitas dummy (${problems.length}):`);
  problems.forEach((item) => console.error(`  - ${item}`));
  process.exit(1);
}

console.log(`Semua ${entries.length} entri aktivitas konsisten (total ${xp} XP).`);
