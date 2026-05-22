"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  WebGLRenderTarget,
  LinearFilter,
  RGBAFormat,
  FloatType,
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  CanvasTexture,
  Vector2,
} from "three";
import { CONFIG } from "@/config";

gsap.registerPlugin(ScrollTrigger);

// ── Shared vertex shader ─────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ── Simulation shader (ping-pong trail mask) ─────────────────────────────────
const fluidFragmentShader = /* glsl */ `
uniform sampler2D uPrevTrails;
uniform vec2 uMouse, uPrevMouse, uResolution;
uniform float uDecay;
uniform bool uIsMoving;
varying vec2 vUv;

void main() {
  vec4 prev = texture2D(uPrevTrails, vUv);
  float newValue = prev.r * uDecay;

  if (uIsMoving) {
    vec2 dir = uMouse - uPrevMouse;
    float len = length(dir);
    if (len > 0.001) {
      vec2 d = dir / len;
      vec2 toPx = vUv - uPrevMouse;
      float proj = clamp(dot(toPx, d), 0.0, len);
      vec2 closest = uPrevMouse + proj * d;
      float dist = length(vUv - closest);
      float lineWidth = 0.09;
      float intensity = smoothstep(lineWidth, 0.0, dist) * 0.3;
      newValue += intensity;
    }
  }

  gl_FragColor = vec4(newValue, 0.0, 0.0, 1.0);
}
`;

// ── Display / composite shader ───────────────────────────────────────────────
const displayFragmentShader = /* glsl */ `
uniform sampler2D uFluid, uTopTexture, uBottomTexture;
uniform vec2 uResolution, uTopTextureSize, uBottomTextureSize;
uniform float uDpr;
varying vec2 vUv;

vec2 getCoverUV(vec2 uv, vec2 ts) {
  if (ts.x < 1.0 || ts.y < 1.0) return uv;
  vec2 s = uResolution / ts;
  float scale = max(s.x, s.y);
  vec2 scaled = ts * scale;
  vec2 offset = (uResolution - scaled) * 0.5;
  return (uv * uResolution - offset) / scaled;
}

void main() {
  float fluid = texture2D(uFluid, vUv).r;

  vec2 topUV    = getCoverUV(vUv, uTopTextureSize);
  vec2 bottomUV = getCoverUV(vUv, uBottomTextureSize);

  vec4 topColor    = texture2D(uTopTexture,    topUV);
  vec4 bottomColor = texture2D(uBottomTexture, bottomUV);

  float threshold = 0.02;
  float edgeWidth = 0.004 / uDpr;
  float t = smoothstep(threshold, threshold + edgeWidth, fluid);

  float halo = smoothstep(0.0, threshold * 2.0, fluid) * (1.0 - t);
  vec3 trailGray = vec3(0.12);
  vec3 tintedTop = mix(topColor.rgb, trailGray, halo * 0.35);

  vec4 finalColor = mix(vec4(tintedTop, topColor.a), bottomColor, t);
  gl_FragColor = finalColor;
}
`;

// ─────────────────────────────────────────────────────────────────────────────

// ── Marquee content — replace these with final copy ──────────────────────────
const MARQUEE_TOP = "·  DEVELOPER  ·  NEXT.JS  ·  TYPESCRIPT  ·  .NET · PYTHON  ";
const MARQUEE_BOT = "·  SOFTWARE ENGINEER  ·  UI / UX  ·  OPEN SOURCE  ·  WEB APPS  ·  AI  ";

export default function HeroReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeTopRef = useRef<HTMLDivElement>(null);
  const marqueeBotRef = useRef<HTMLDivElement>(null);

  // ── Scroll animation ─────────────────────────────────────────────────────
  useGSAP(
    () => {
      if (!canvasRef.current || !sectionRef.current) return;

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

      // Marquee top — left → right (element moves right)
      if (marqueeTopRef.current) {
        gsap.fromTo(
          marqueeTopRef.current,
          { xPercent: -50 },
          { xPercent: 0, duration: 24, ease: "none", repeat: -1 },
        );
      }

      // Marquee bottom — right → left (element moves left)
      if (marqueeBotRef.current) {
        gsap.fromTo(
          marqueeBotRef.current,
          { xPercent: 0 },
          { xPercent: -50, duration: 30, ease: "none", repeat: -1 },
        );
      }
    },
    { scope: sectionRef, dependencies: [] },
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── 0. Visibility tracking — pause render loop when off-screen ────────────
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    // ── 1. Renderer ───────────────────────────────────────────────────────────
    // clientWidth/clientHeight exclude the scrollbar — avoids horizontal overflow
    const cw = () => document.documentElement.clientWidth;
    const ch = () => document.documentElement.clientHeight; // subtract navbar height

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      precision: "highp",
    });
    renderer.setSize(cw(), ch());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── 2. Camera + Scenes ────────────────────────────────────────────────────
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new Scene();
    const simScene = new Scene();

    // ── 3. Ping-pong render targets ───────────────────────────────────────────
    const rtOptions = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBAFormat,
      type: FloatType,
    };
    const pingPong = [
      new WebGLRenderTarget(CONFIG.simSize, CONFIG.simSize, rtOptions),
      new WebGLRenderTarget(CONFIG.simSize, CONFIG.simSize, rtOptions),
    ];
    renderer.setRenderTarget(pingPong[0]);
    renderer.clear();
    renderer.setRenderTarget(pingPong[1]);
    renderer.clear();
    renderer.setRenderTarget(null);

    let currentTarget = 0;

    // ── 4. Mouse state ────────────────────────────────────────────────────────
    const mouse = new Vector2(0.5, 0.5);
    const prevMouse = new Vector2(0.5, 0.5);
    const autoMouse = new Vector2(0.5, 0.5);
    const prevAutoMouse = new Vector2(0.5, 0.5);
    let isMoving = false;
    let lastMoveTime = 0;

    // ── 5. Placeholder textures ───────────────────────────────────────────────
    function makeColorCanvas(hex: string): CanvasTexture {
      const c = document.createElement("canvas");
      c.width = 2;
      c.height = 2;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = hex;
      ctx.fillRect(0, 0, 2, 2);
      return new CanvasTexture(c);
    }
    const topPlaceholder = makeColorCanvas("#0000ff");
    const bottomPlaceholder = makeColorCanvas("#ff0000");

    // ── 6. Geometry ───────────────────────────────────────────────────────────
    const geometry = new PlaneGeometry(2, 2);

    // ── 7. Texture-size uniform vectors ───────────────────────────────────────
    const uTopTextureSize = new Vector2(1, 1);
    const uBottomTextureSize = new Vector2(1, 1);
    const dpr = Math.min(window.devicePixelRatio, 2);

    // ── 8. ShaderMaterials ────────────────────────────────────────────────────
    const trailsMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader: fluidFragmentShader,
      uniforms: {
        uPrevTrails: { value: pingPong[0].texture },
        uMouse: { value: new Vector2(0.5, 0.5) },
        uPrevMouse: { value: new Vector2(0.5, 0.5) },
        uResolution: { value: new Vector2(CONFIG.simSize, CONFIG.simSize) },
        uDecay: { value: CONFIG.decay },
        uIsMoving: { value: false },
      },
    });

    const displayMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader: displayFragmentShader,
      uniforms: {
        uFluid: { value: pingPong[0].texture },
        uTopTexture: { value: topPlaceholder },
        uBottomTexture: { value: bottomPlaceholder },
        uTopTextureSize: { value: uTopTextureSize },
        uBottomTextureSize: { value: uBottomTextureSize },
        uResolution: { value: new Vector2(cw(), ch()) },
        uDpr: { value: dpr },
      },
    });

    // ── 9. Meshes ─────────────────────────────────────────────────────────────
    simScene.add(new Mesh(geometry, trailsMaterial));
    scene.add(new Mesh(geometry, displayMaterial));

    // ── 10. Image loader ──────────────────────────────────────────────────────
    function loadImage(
      src: string,
      sizeUniform: Vector2,
      textureUniform: { value: unknown },
    ) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        let source: HTMLImageElement | HTMLCanvasElement = img;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > CONFIG.maxTextureSize || h > CONFIG.maxTextureSize) {
          const ratio = Math.min(
            CONFIG.maxTextureSize / w,
            CONFIG.maxTextureSize / h,
          );
          w = Math.floor(w * ratio);
          h = Math.floor(h * ratio);
          const offscreen = document.createElement("canvas");
          offscreen.width = w;
          offscreen.height = h;
          offscreen.getContext("2d")!.drawImage(img, 0, 0, w, h);
          source = offscreen;
        }
        const tex = new CanvasTexture(source);
        sizeUniform.set(w, h);
        textureUniform.value = tex;
        console.log(`[HeroReveal] Loaded: ${src} (${w}×${h})`);
      };
      img.onerror = () => console.error(`[HeroReveal] Failed to load: ${src}`);
      img.src = src;
    }

    loadImage(
      "/images/taha_top.png",
      uTopTextureSize,
      displayMaterial.uniforms.uTopTexture,
    );
    loadImage(
      "/images/taha_bot.png",
      uBottomTextureSize,
      displayMaterial.uniforms.uBottomTexture,
    );

    // ── 11. Render loop ───────────────────────────────────────────────────────
    let animId: number;

    function animate() {
      animId = requestAnimationFrame(animate);

      // Skip all GPU work when canvas is scrolled out of view
      if (!isVisible) return;

      const now = performance.now();

      // Stop detection
      if (isMoving && now - lastMoveTime > CONFIG.stopAfterMs) {
        isMoving = false;
      }

      const idleTime = now - lastMoveTime;
      const autoActive = idleTime > CONFIG.idleThresholdMs;

      // Ping-pong swap
      const prevTarget = pingPong[currentTarget];
      currentTarget = (currentTarget + 1) % 2;
      const writeTarget = pingPong[currentTarget];

      trailsMaterial.uniforms.uPrevTrails.value = prevTarget.texture;

      if (autoActive) {
        const easeIn = Math.min(
          1,
          (idleTime - CONFIG.idleThresholdMs) / CONFIG.idleEaseInMs,
        );
        const t = now * 0.001;
        // Layered incommensurate sines — organic path, never off-canvas
        const targetX =
          0.5 + 0.3 * Math.sin(t * 0.41) + 0.12 * Math.sin(t * 0.93 + 1.3);
        const targetY =
          0.5 +
          0.28 * Math.cos(t * 0.37 + 0.5) +
          0.1 * Math.cos(t * 1.11 + 2.7);

        prevAutoMouse.copy(autoMouse);
        autoMouse.x += (targetX - autoMouse.x) * CONFIG.autoLerp * easeIn;
        autoMouse.y += (targetY - autoMouse.y) * CONFIG.autoLerp * easeIn;

        trailsMaterial.uniforms.uMouse.value.copy(autoMouse);
        trailsMaterial.uniforms.uPrevMouse.value.copy(prevAutoMouse);
        trailsMaterial.uniforms.uIsMoving.value = true;

        // Mirror so next real move continues from here — no stale long segment
        mouse.copy(autoMouse);
        prevMouse.copy(prevAutoMouse);
      } else {
        trailsMaterial.uniforms.uMouse.value.copy(mouse);
        trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
        trailsMaterial.uniforms.uIsMoving.value = isMoving;

        // Mirror so next idle cycle starts from user's last position
        autoMouse.copy(mouse);
        prevAutoMouse.copy(mouse);
      }

      // Render simulation into writeTarget
      renderer.setRenderTarget(writeTarget);
      renderer.render(simScene, camera);

      // Render composite to screen
      displayMaterial.uniforms.uFluid.value = writeTarget.texture;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    }

    animate();

    // ── 12. Input handlers ────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const now = performance.now();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        prevMouse.copy(mouse);
        mouse.x = (e.clientX - rect.left) / rect.width;
        mouse.y = 1 - (e.clientY - rect.top) / rect.height;
        isMoving = true;
        lastMoveTime = now;
      } else {
        isMoving = false;
        // Do NOT update lastMoveTime — lets auto-trail keep running
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.cancelable) e.preventDefault();
      const rect = canvas!.getBoundingClientRect();
      const now = performance.now();
      const touch = e.touches[0];
      if (
        touch.clientX >= rect.left &&
        touch.clientX <= rect.right &&
        touch.clientY >= rect.top &&
        touch.clientY <= rect.bottom
      ) {
        prevMouse.copy(mouse);
        mouse.x = (touch.clientX - rect.left) / rect.width;
        mouse.y = 1 - (touch.clientY - rect.top) / rect.height;
        isMoving = true;
        lastMoveTime = now;
      } else {
        isMoving = false;
      }
    }

    function onResize() {
      renderer.setSize(cw(), ch());
      displayMaterial.uniforms.uResolution.value.set(cw(), ch());
      displayMaterial.uniforms.uDpr.value = Math.min(
        window.devicePixelRatio,
        2,
      );
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize);

    // ── 13. Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      pingPong[0].dispose();
      pingPong[1].dispose();
      trailsMaterial.dispose();
      displayMaterial.dispose();
      geometry.dispose();
      topPlaceholder.dispose();
      bottomPlaceholder.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-wrapper">
      <section ref={sectionRef} className="hero">
        {/* ── Background marquees (visible when canvas is scaled down) ── */}
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
          {/* Row 1 — blue, scrolls left → right */}
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

          {/* Row 2 — dark, scrolls right → left */}
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

        {/* Canvas + overlay — scale together as one unit */}
        <div ref={canvasWrapperRef} className="absolute inset-0 z-[1] overflow-hidden will-change-transform">
          <canvas id="hero-canvas" ref={canvasRef} />

          {/* ── Hero text overlay ── */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 md:p-10 lg:p-14 pointer-events-none select-none">
            {/* Top row */}
            <div className="flex items-start justify-between">
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-neutral-800">
                N — 01 / Portfolio 2025–26
              </span>
              <span className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-neutral-800">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                </span>
                
              </span>
            </div>

            {/* Bottom row */}
            <div className="flex items-end justify-between gap-8">
              <h1 className="flex flex-col leading-none">
                <span className="text-[clamp(2.6rem,5vw,4.8rem)] font-black tracking-[-0.025em] text-neutral-900">
                  Taha Pek
                </span>
                <span className="text-[clamp(2rem,4vw,3.8rem)] font-light italic tracking-[-0.01em] text-neutral-600">
                  — Full Stack Dev.
                </span>
              </h1>
              <div className="flex flex-col items-end gap-2 pb-1">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-500">
                  Code meets craft
                </span>
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-500">
                  Code. Ship. Repeat.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
