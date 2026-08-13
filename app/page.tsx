"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation"; // <-- Novo import
import { chapters, getParts, chapterStats } from "@/content/chapters";
import { pad } from "@/lib/utils";
import { Kbd } from "@/components/ui/Kbd";
import { CoverKeys } from "@/components/chrome/CoverKeys";
import { chapterHref } from "@/lib/slide-filter";

// 1. Movemos toda a lógica visual para este sub-componente
function CoverContent() {
  const searchParams = useSearchParams();
  const pathParam = searchParams.get("path"); // <-- Lendo o parâmetro via hook
  
  const lessonMode = pathParam === "lesson";
  const path = lessonMode ? "lesson" : "full";
  const parts = getParts();
  const firstSlug = chapters[0].slug;

  return (
    <>
      <CoverKeys firstSlug={firstSlug} lessonPath={path} />
      
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 py-10 md:px-8">
        <header className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          <span className="text-ink">Black Bee Drones · Nectar SDK</span>
          <span>2026</span>
        </header>

        <div className="mt-16 grid grid-cols-12 gap-8 pb-12 md:mt-24">
          <div className="col-span-12 lg:col-span-6">
            <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-honey">
              Material do curso
            </div>
            <h1 className="font-serif text-[48px] font-medium leading-[0.95] tracking-tight-3 md:text-[72px]">
              Inteligência Artificial e Visão Computacional
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
              Introdução, definição, problemas e aplicações sobre IA dividida em 3 partes, pela equipe Black Bee Drones.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/chapter/${firstSlug}?path=lesson`}
                className="inline-flex items-center gap-2 rounded-md border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-surface transition hover:bg-ink/90"
              >
                Iniciar trilha de lição
                <ArrowRight size={14} />
              </Link>
              <Link
                href={`/chapter/${firstSlug}`}
                className="inline-flex items-center gap-2 rounded-md border border-stroke bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted transition hover:border-ink hover:text-ink"
              >
                Deck completo
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              <span>Pressione</span>
              <Kbd>↓</Kbd>
              <span>ou</span>
              <Kbd>→</Kbd>
              <span>para começar · </span>
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd>
              <span>capítulos · </span>
              <Kbd>←</Kbd>
              <Kbd>→</Kbd>
              <span>slides</span>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:pl-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
              Conteúdo {lessonMode ? "· trilha de lição" : "· deck completo"}
            </div>
            <div className="mt-4 space-y-6">
              {parts.map((part) => (
                <div key={part.number}>
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-honey">
                    Part {part.number} · {part.title}
                  </div>
                  <ol className="divide-y divide-stroke border-y border-stroke">
                    {part.chapters.map((c) => {
                      const stats = chapterStats(c);
                      return (
                        <li key={c.id}>
                          <Link
                            href={chapterHref(c.slug, path)}
                            className="group flex items-center justify-between py-3 transition hover:bg-surface"
                          >
                            <div className="flex items-baseline gap-4">
                              <span className="font-mono text-[11px] tabular-nums text-muted">
                                {pad(c.number)}
                              </span>
                              <div>
                                <span className="font-serif text-[17px] text-ink">{c.title}</span>
                                {c.subtitle ? (
                                  <div className="text-[12px] text-muted">{c.subtitle}</div>
                                ) : null}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[10px] tabular-nums text-muted">
                                {stats.core}/{stats.total}
                              </span>
                              <ArrowRight
                                size={14}
                                strokeWidth={1.5}
                                className="text-muted transition group-hover:translate-x-1 group-hover:text-ink"
                              />
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-auto flex items-center justify-between border-t border-stroke pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          <span>nectar-sdk · módulo de IA</span>
          <span>{chapters.length} capítulos</span>
        </footer>
      </div>
    </>
  );
}

// 2. O componente principal agora apenas provê o Suspense
export default function Cover() {
  return (
    <div className="relative min-h-screen bg-bone">
      {/* O fallback vazio evita flashes na tela enquanto o hook carrega os parâmetros */}
      <Suspense fallback={null}>
        <CoverContent />
      </Suspense>
    </div>
  );
}