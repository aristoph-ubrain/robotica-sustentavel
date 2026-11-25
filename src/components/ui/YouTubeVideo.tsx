"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

type YouTubeVideoProps = {
  id: string;
  /** Título do vídeo: vira o `title` do iframe e o nome acessível do botão. */
  title: string;
  /** Texto do botão de play (ex.: "Assistir ao vídeo"). */
  playLabel: string;
  sizes: string;
  /** Carrega a miniatura com prioridade (vídeo acima da dobra). */
  preload?: boolean;
  /**
   * Começa a tocar sozinho, sem som, assim que a página termina de carregar
   * (navegadores só permitem autoplay mudo). Não acontece para quem pediu
   * menos movimento no sistema: essa pessoa vê a capa e o botão de play.
   */
  autoplay?: boolean;
  className?: string;
};

/**
 * Vídeo do YouTube "leve": mostra só a miniatura e um botão de play; o player
 * (~1 MB de scripts e cookies do YouTube) só carrega quando a pessoa clica.
 * Usa youtube-nocookie.com, que não grava cookies antes do play.
 */
export default function YouTubeVideo({
  id,
  title,
  playLabel,
  sizes,
  preload = false,
  autoplay = false,
  className,
}: YouTubeVideoProps) {
  // "auto" = começou sozinho (mudo); "click" = a pessoa apertou play (com som).
  const [playing, setPlaying] = useState<false | "auto" | "click">(false);

  useEffect(() => {
    if (!autoplay) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Espera a página carregar: a capa continua sendo o maior elemento
    // inicial e o player não disputa banda com o resto do conteúdo.
    const start = () => setPlaying((current) => current || "auto");
    if (document.readyState === "complete") {
      const timer = window.setTimeout(start, 0);
      return () => window.clearTimeout(timer);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [autoplay]);

  return (
    <div className={cn("relative aspect-video overflow-hidden bg-tinta", className)}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1${playing === "auto" ? "&mute=1" : ""}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying("click")}
          aria-label={`${playLabel}: ${title}`}
          className="group absolute inset-0 size-full cursor-pointer focus-visible:-outline-offset-[6px]"
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            fill
            preload={preload}
            sizes={sizes}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-tinta/20 transition-colors group-hover:bg-tinta/10"
          />
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amarelo text-tinta shadow-lg transition-transform group-hover:scale-110 motion-reduce:transition-none lg:size-20"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 size-7 lg:size-9">
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
