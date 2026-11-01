"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TOP = "·  DEVELOPER  ·  NEXT.JS  ·  TYPESCRIPT  ·  .NET · PYTHON  ";
const MARQUEE_BOT = "·  SOFTWARE ENGINEER  ·  UI / UX  ·  OPEN SOURCE  ·  WEB APPS  ·  AI  ";

export default function HeroReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeTopRef = useRef<HTMLDivElement>(null);
  const marqueeBotRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(canvasWrapperRef.current, {
          scale: 0.5,
          borderRadius: "40px",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=800",
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        gsap.fromTo(
          marqueeTopRef.current,
          { xPercent: -50 },
          { xPercent: 0, duration: 24, ease: "none", repeat: -1 },
        );
        gsap.fromTo(
          marqueeBotRef.current,
          { xPercent: 0 },
          { xPercent: -50, duration: 30, ease: "none", repeat: -1 },
        );
      });
    },
    { scope: sectionRef, dependencies: [] },
  );

  // three.js is a separate chunk started when the main thread is idle;
  // the static poster stays visible if WebGL never starts.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const run = () => {
      import("./heroWebgl").then(({ initHeroWebGL }) => {
        if (cancelled) return;
        cleanup = initHeroWebGL(canvas, {
          onReady: () => {
            canvas.style.opacity = "1";
          },
        });
      });
    };

    const hasIdle = "requestIdleCallback" in window;
    const handle = hasIdle
      ? window.requestIdleCallback(run, { timeout: 3000 })
      : window.setTimeout(run, 300);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      cleanup?.();
    };
  }, []);

  return (
    <div className="hero-wrapper">
      <section ref={sectionRef} className="hero">
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.5rem",
            zIndex: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div style={{ overflow: "hidden", width: "100%" }}>
            <div
              ref={marqueeTopRef}
              style={{
                display: "flex",
                width: "max-content",
                whiteSpace: "nowrap",
              }}
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  aria-hidden={i === 1}
                  style={{
                    fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#1d4ed8",
                    opacity: 0.85,
                    userSelect: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.1,
                  }}
                >
                  {MARQUEE_TOP}
                </span>
              ))}
            </div>
          </div>

          <div style={{ overflow: "hidden", width: "100%" }}>
            <div
              ref={marqueeBotRef}
              style={{
                display: "flex",
                width: "max-content",
                whiteSpace: "nowrap",
              }}
            >
              {[0, 1].map((i) => (
                <span
                  key={i}
                  aria-hidden={i === 1}
                  style={{
                    fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
                    fontWeight: 900,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#0f172a",
                    opacity: 0.9,
                    userSelect: "none",
                    fontFamily: "inherit",
                    lineHeight: 1.1,
                  }}
                >
                  {MARQUEE_BOT}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={canvasWrapperRef}
          className="absolute inset-0 z-[1] overflow-hidden will-change-transform"
        >
          <Image
            src="/images/taha_top.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            aria-hidden="true"
          />
          <canvas
            id="hero-canvas"
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 opacity-0 transition-opacity duration-700"
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-10 lg:p-14 pointer-events-none select-none">
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-neutral-800">
                N — 01 / Portfolio 2025–26
              </span>
              <span className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-800">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
              </span>
            </div>

            <div className="flex items-end justify-between gap-8">
              <h1 className="flex flex-col leading-none">
                <span className="text-[clamp(2.6rem,5vw,4.8rem)] font-black tracking-[-0.025em] text-neutral-900">
                  Taha Pek
                </span>
                <span className="text-[clamp(2rem,4vw,3.8rem)] font-light italic tracking-[-0.01em] text-neutral-700">
                  — Full Stack Dev.
                </span>
              </h1>
              <div className="flex flex-col items-end gap-2 pb-1">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-700">
                  Code meets craft
                </span>
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-700">
                  Code. Ship. Repeat.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
