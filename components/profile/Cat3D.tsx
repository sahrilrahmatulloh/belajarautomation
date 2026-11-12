"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/lib/useReducedMotion";

type LoadState = "loading" | "ready" | "error";

function supportsWebGl() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Menunggu halaman selesai dimuat dan browser senggang, agar model 3D tidak memperlambat
// isi profil (PRD FR-12, Model 3D kucing).
function whenIdle(callback: () => void) {
  let idleId: number | undefined;
  let timeoutId: number | undefined;
  const schedule = () => {
    // Safari belum mendukung requestIdleCallback.
    if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(callback, { timeout: 1500 });
    else timeoutId = window.setTimeout(callback, 200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  };
}

// Kucing 3D dekoratif di banner profil. Three.js dimuat terpisah hanya saat komponen ini
// tampil. Bila perangkat tidak mendukung WebGL atau model gagal dimuat, komponen tidak
// menampilkan apa pun dan banner tetap utuh.
export default function Cat3D({ src, className = "" }: { src: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!supportsWebGl()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- dukungan WebGL hanya bisa diperiksa di browser
      setState("error");
      return;
    }

    let disposed = false;
    let cleanupScene: (() => void) | undefined;
    let cancelIdle: (() => void) | undefined;

    const load = async () => {
      try {
        const THREE = await import("three");
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
        camera.position.set(0, 0.55, 3.1);
        camera.lookAt(0, 0.5, 0);

        scene.add(new THREE.HemisphereLight(0xffffff, 0x9fb4c8, 2.2));
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
        keyLight.position.set(1.5, 2.5, 2.5);
        scene.add(keyLight);

        const gltf = await new GLTFLoader().loadAsync(src);
        if (disposed) {
          renderer.dispose();
          return;
        }

        // Model dinormalkan: tinggi 1, alas di y = 0, berada di tengah sumbu x dan z.
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const scale = 1 / Math.max(size.y, 0.001);
        model.scale.setScalar(scale);
        model.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
        const pivot = new THREE.Group();
        pivot.add(model);
        scene.add(pivot);

        const resize = () => {
          const { clientWidth, clientHeight } = container;
          if (clientWidth === 0 || clientHeight === 0) return;
          renderer.setSize(clientWidth, clientHeight, false);
          camera.aspect = clientWidth / clientHeight;
          camera.updateProjectionMatrix();
        };
        resize();
        container.appendChild(renderer.domElement);

        // Gerakan diam yang pelan: sedikit bergoyang dan bernapas. Berhenti saat banner tidak
        // terlihat atau tab disembunyikan; "kurangi gerakan" hanya merender pose diam.
        let frame = 0;
        let visible = true;
        const clock = new THREE.Clock();
        const render = () => renderer.render(scene, camera);
        const tick = () => {
          frame = 0;
          const time = clock.getElapsedTime();
          pivot.rotation.y = Math.sin(time * 0.6) * 0.22;
          pivot.position.y = Math.sin(time * 1.6) * 0.012;
          pivot.scale.set(1, 1 + Math.sin(time * 1.6) * 0.008, 1);
          render();
          if (visible && !document.hidden) frame = requestAnimationFrame(tick);
        };
        const start = () => {
          if (reducedMotion) render();
          else if (!frame) frame = requestAnimationFrame(tick);
        };

        const resizeObserver = new ResizeObserver(() => {
          resize();
          if (reducedMotion) render();
        });
        resizeObserver.observe(container);
        const intersectionObserver = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible) start();
        });
        intersectionObserver.observe(container);
        const onVisibility = () => {
          if (!document.hidden) start();
        };
        document.addEventListener("visibilitychange", onVisibility);

        start();
        setState("ready");

        cleanupScene = () => {
          cancelAnimationFrame(frame);
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          document.removeEventListener("visibilitychange", onVisibility);
          model.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              const materials = Array.isArray(object.material) ? object.material : [object.material];
              materials.forEach((material) => material.dispose());
            }
          });
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
        };
      } catch {
        if (!disposed) setState("error");
      }
    };

    // Wadah disembunyikan CSS di layar kecil (PRD FR-12). Three.js dan model baru diunduh saat
    // wadahnya benar-benar tampil, agar perangkat mobile tidak memuat data yang tidak terlihat.
    const startWhenShown = new ResizeObserver(() => {
      if (container.clientWidth === 0 || cancelIdle) return;
      startWhenShown.disconnect();
      cancelIdle = whenIdle(() => void load());
    });
    startWhenShown.observe(container);

    return () => {
      disposed = true;
      startWhenShown.disconnect();
      cancelIdle?.();
      cleanupScene?.();
    };
  }, [src, reducedMotion]);

  if (state === "error") return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-cat-3d={state}
      className={`pointer-events-none transition-opacity duration-700 ${state === "ready" ? "opacity-100" : "opacity-0"} ${className}`}
    />
  );
}
