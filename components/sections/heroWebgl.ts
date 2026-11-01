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

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Ping-pong trail mask simulation
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

  gl_FragColor = mix(vec4(tintedTop, topColor.a), bottomColor, t);
}
`;

interface Options {
  onReady: () => void;
}

export function initHeroWebGL(
  canvas: HTMLCanvasElement,
  { onReady }: Options,
): () => void {
  const small = window.matchMedia("(max-width: 767px)").matches;
  const dpr = Math.min(window.devicePixelRatio, small ? 1.25 : 2);
  const simSize = small ? 256 : CONFIG.simSize;
  const suffix = small ? "-sm" : "";

  const cw = () => document.documentElement.clientWidth;
  const ch = () => document.documentElement.clientHeight;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: !small,
      precision: "highp",
    });
  } catch {
    return () => {};
  }
  renderer.setSize(cw(), ch());
  renderer.setPixelRatio(dpr);

  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene = new Scene();
  const simScene = new Scene();

  const rtOptions = {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
    type: FloatType,
  };
  const pingPong = [
    new WebGLRenderTarget(simSize, simSize, rtOptions),
    new WebGLRenderTarget(simSize, simSize, rtOptions),
  ];
  for (const rt of pingPong) {
    renderer.setRenderTarget(rt);
    renderer.clear();
  }
  renderer.setRenderTarget(null);

  let currentTarget = 0;

  const mouse = new Vector2(0.5, 0.5);
  const prevMouse = new Vector2(0.5, 0.5);
  const autoMouse = new Vector2(0.5, 0.5);
  const prevAutoMouse = new Vector2(0.5, 0.5);
  let isMoving = false;
  let lastMoveTime = 0;

  const geometry = new PlaneGeometry(2, 2);
  const uTopTextureSize = new Vector2(1, 1);
  const uBottomTextureSize = new Vector2(1, 1);

  const trailsMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader: fluidFragmentShader,
    uniforms: {
      uPrevTrails: { value: pingPong[0].texture },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uPrevMouse: { value: new Vector2(0.5, 0.5) },
      uResolution: { value: new Vector2(simSize, simSize) },
      uDecay: { value: CONFIG.decay },
      uIsMoving: { value: false },
    },
  });

  const displayMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader: displayFragmentShader,
    uniforms: {
      uFluid: { value: pingPong[0].texture },
      uTopTexture: { value: null },
      uBottomTexture: { value: null },
      uTopTextureSize: { value: uTopTextureSize },
      uBottomTextureSize: { value: uBottomTextureSize },
      uResolution: { value: new Vector2(cw(), ch()) },
      uDpr: { value: dpr },
    },
  });

  simScene.add(new Mesh(geometry, trailsMaterial));
  scene.add(new Mesh(geometry, displayMaterial));

  let disposed = false;
  let loaded = 0;
  const textures: { dispose(): void }[] = [];

  function loadImage(
    src: string,
    sizeUniform: Vector2,
    textureUniform: { value: unknown },
  ) {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      const tex = new CanvasTexture(img);
      textures.push(tex);
      sizeUniform.set(img.naturalWidth, img.naturalHeight);
      textureUniform.value = tex;
      loaded += 1;
      if (loaded === 2) {
        start();
        onReady();
      }
    };
    img.src = src;
  }

  loadImage(
    `/images/taha_top${suffix}.webp`,
    uTopTextureSize,
    displayMaterial.uniforms.uTopTexture,
  );
  loadImage(
    `/images/taha_bot${suffix}.webp`,
    uBottomTextureSize,
    displayMaterial.uniforms.uBottomTexture,
  );

  let isVisible = true;
  let running = false;
  let animId = 0;

  function animate() {
    if (disposed || !isVisible) {
      running = false;
      return;
    }
    animId = requestAnimationFrame(animate);

    const now = performance.now();
    if (isMoving && now - lastMoveTime > CONFIG.stopAfterMs) isMoving = false;

    const idleTime = now - lastMoveTime;
    const autoActive = idleTime > CONFIG.idleThresholdMs;

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
      const targetX =
        0.5 + 0.3 * Math.sin(t * 0.41) + 0.12 * Math.sin(t * 0.93 + 1.3);
      const targetY =
        0.5 + 0.28 * Math.cos(t * 0.37 + 0.5) + 0.1 * Math.cos(t * 1.11 + 2.7);

      prevAutoMouse.copy(autoMouse);
      autoMouse.x += (targetX - autoMouse.x) * CONFIG.autoLerp * easeIn;
      autoMouse.y += (targetY - autoMouse.y) * CONFIG.autoLerp * easeIn;

      trailsMaterial.uniforms.uMouse.value.copy(autoMouse);
      trailsMaterial.uniforms.uPrevMouse.value.copy(prevAutoMouse);
      trailsMaterial.uniforms.uIsMoving.value = true;

      mouse.copy(autoMouse);
      prevMouse.copy(prevAutoMouse);
    } else {
      trailsMaterial.uniforms.uMouse.value.copy(mouse);
      trailsMaterial.uniforms.uPrevMouse.value.copy(prevMouse);
      trailsMaterial.uniforms.uIsMoving.value = isMoving;

      autoMouse.copy(mouse);
      prevAutoMouse.copy(mouse);
    }

    renderer.setRenderTarget(writeTarget);
    renderer.render(simScene, camera);

    displayMaterial.uniforms.uFluid.value = writeTarget.texture;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }

  function start() {
    if (running || disposed || loaded < 2) return;
    running = true;
    animId = requestAnimationFrame(animate);
  }

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) start();
  });
  observer.observe(canvas);

  function track(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    const now = performance.now();
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      prevMouse.copy(mouse);
      mouse.x = (clientX - rect.left) / rect.width;
      mouse.y = 1 - (clientY - rect.top) / rect.height;
      isMoving = true;
      lastMoveTime = now;
    } else {
      // lastMoveTime stays untouched so the idle auto-trail keeps running
      isMoving = false;
    }
  }

  const onMouseMove = (e: MouseEvent) => track(e.clientX, e.clientY);
  const onTouchMove = (e: TouchEvent) =>
    track(e.touches[0].clientX, e.touches[0].clientY);
  const onResize = () => {
    renderer.setSize(cw(), ch());
    displayMaterial.uniforms.uResolution.value.set(cw(), ch());
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("resize", onResize);

  return () => {
    disposed = true;
    cancelAnimationFrame(animId);
    observer.disconnect();
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("resize", onResize);
    pingPong.forEach((rt) => rt.dispose());
    textures.forEach((t) => t.dispose());
    trailsMaterial.dispose();
    displayMaterial.dispose();
    geometry.dispose();
    renderer.dispose();
  };
}
