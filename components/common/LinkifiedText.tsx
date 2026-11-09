import { ExternalLink } from "lucide-react";

// Teks dari pengguna dengan tautan http/https yang dapat diklik (PRD FR-13, Tentang saya).
// Selain http/https (mis. javascript:) tetap tampil sebagai teks biasa. Tautan dibuka di
// tab baru dan diberi rel nofollow ugc agar profil tidak menarik bagi spam.
const URL_PATTERN = /(https?:\/\/[^\s<>"']+)/g;

// Tanda baca di akhir kalimat bukan bagian dari tautan.
function splitTrailingPunctuation(url: string) {
  const match = url.match(/[.,!?;:)\]]+$/);
  return match ? [url.slice(0, -match[0].length), match[0]] : [url, ""];
}

function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function LinkifiedText({ text, linkClassName = "" }: { text: string; linkClassName?: string }) {
  const parts = text.split(URL_PATTERN);

  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 0) return part;
        const [url, trailing] = splitTrailingPunctuation(part);
        let isValid = false;
        try {
          isValid = ["http:", "https:"].includes(new URL(url).protocol);
        } catch {
          isValid = false;
        }
        if (!isValid) return part;
        return (
          <span key={index}>
            <a
              href={url}
              target="_blank"
              rel="nofollow ugc noopener noreferrer"
              className={`inline-flex items-center gap-0.5 break-all font-medium underline underline-offset-2 ${linkClassName}`}
            >
              {displayUrl(url)}
              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="sr-only"> (membuka tab baru)</span>
            </a>
            {trailing}
          </span>
        );
      })}
    </>
  );
}
