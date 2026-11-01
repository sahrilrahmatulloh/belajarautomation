import Image from "next/image";

export default function WelcomeBanner() {
  return (
    <section className="relative isolate flex flex-col overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-sm sm:flex-row sm:items-center sm:min-h-48 lg:min-h-56">
      {/* Ilustrasi: di atas teks pada mobile, di sisi kanan mulai tablet */}
      <div className="relative h-40 w-full sm:absolute sm:inset-y-0 sm:right-0 sm:h-auto sm:w-[40%] lg:w-[44%]">
        <Image
          src="/banner/basic-banner.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 40vw, 100vw"
          className="object-cover object-[50%_40%]"
        />

        {/* Gradasi tepi: bawah pada mobile, kiri mulai tablet */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-card to-transparent sm:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-card to-transparent sm:block"
        />
      </div>

      {/* Kolom teks dibatasi agar tidak menimpa ilustrasi; di tengah secara vertikal mulai tablet */}
      <div className="relative p-5 sm:max-w-[60%] sm:p-6 lg:max-w-[56%]">
        <p className="text-xs font-semibold text-brand-blue sm:text-sm">
          Belajar · Practice · Build · Grow
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Halo, <span className="text-primary">Sobat QA!</span>
        </h1>

        <p className="mt-2 text-sm leading-5 text-muted-foreground sm:text-base sm:leading-6">
          Terus belajar dan bangun skill QA Automation untuk masa depan yang lebih baik.
        </p>
      </div>
    </section>
  );
}
