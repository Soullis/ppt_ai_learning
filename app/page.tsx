import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { chapters } from "@/content/chapters";
import { pad } from "@/lib/utils";
import { Kbd } from "@/components/ui/Kbd";
import { CoverKeys } from "@/components/chrome/CoverKeys";

export default function Cover() {
  return (
    <div className="relative min-h-screen bg-bone">
      <CoverKeys firstSlug={chapters[0].slug} />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-8 py-10">
        <header className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span className="text-ink">Black Bee Drones · Nectar SDK</span>
          <span>2026</span>
        </header>

        <div className="mt-auto grid grid-cols-12 gap-8 pb-12 pt-24">
          <div className="col-span-12 md:col-span-7">
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-honey">
              A Presentation
            </div>
            <h1 className="font-serif text-[64px] font-medium leading-[0.95] tracking-tight-3 md:text-[88px]">
              AI for Aerial Robotics
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
              From the perceptron to the Nectar SDK detection workflow.
              <br />
              Twelve chapters tracing the field, the math, the architectures,
              and the practice we use at Black Bee.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              <span>Press</span>
              <Kbd>↓</Kbd>
              <span>or</span>
              <Kbd>→</Kbd>
              <span>to start · </span>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span>change chapters · </span>
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
              <span>change slides</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-5 md:pl-12">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Contents
            </div>
            <ol className="mt-4 divide-y divide-stroke border-y border-stroke">
              {chapters.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/chapter/${c.slug}`}
                    className="group flex items-center justify-between py-3 transition hover:bg-surface"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[11px] tabular-nums text-muted">
                        {pad(c.number)}
                      </span>
                      <span className="font-serif text-[17px] text-ink">
                        {c.title}
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      strokeWidth={1.5}
                      className="text-muted transition group-hover:translate-x-1 group-hover:text-ink"
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <footer className="mt-auto flex items-center justify-between border-t border-stroke pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <span>nectar-sdk · ai module</span>
          <span>{chapters.length} chapters</span>
        </footer>
      </div>
    </div>
  );
}
