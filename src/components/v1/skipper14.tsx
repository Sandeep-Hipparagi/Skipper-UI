"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { cn } from "@/lib/utils";

export interface AsciiSimulationProps {
  modelPath?: string;
  characters?: string;
  invert?: boolean;
  fontSize?: string;
  lineHeight?: string;
  scale?: number;
  rotationSpeed?: number;
  zoomSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableRotate?: boolean;
  rotateSpeed?: number;
  backgroundColor?: string;
  textColor?: string;
  fontFamily?: string;
  className?: string;
}

export const AsciiSimulation: React.FC<AsciiSimulationProps> = ({
  modelPath = "/models/car.glb",
  characters = " .:-=+*#%@",
  invert = true,
  fontSize = "11px",
  lineHeight = "9px",
  scale = 0.8,
  rotationSpeed = 0.0004,
  zoomSpeed = 1,
  enableZoom = true,
  enablePan = false,
  enableRotate = true,
  rotateSpeed = 0.5,
  backgroundColor = "#000000",
  textColor = "#00ff66",
  fontFamily = "monospace",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 4.5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    let modelGroup: THREE.Group | null = null;
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        modelGroup = gltf.scene;
        modelGroup.position.set(0, -0.3, 0);
        modelGroup.scale.set(scale, scale, scale);
        scene.add(modelGroup);
      },
      undefined,
      (err) => {
        console.error("Error loading GLTF in ASCII simulation:", err);
      }
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);

    const effect = new AsciiEffect(renderer, characters, { invert });
    effect.setSize(width, height);
    effect.domElement.style.color = textColor;
    effect.domElement.style.backgroundColor = backgroundColor;
    effect.domElement.style.fontFamily = fontFamily;
    effect.domElement.style.fontSize = fontSize;
    effect.domElement.style.lineHeight = lineHeight;
    effect.domElement.style.cursor = "grab";
    effect.domElement.style.userSelect = "none";

    container.appendChild(effect.domElement);

    const controls = new OrbitControls(camera, effect.domElement);
    controls.enableZoom = enableZoom;
    controls.enablePan = enablePan;
    controls.enableRotate = enableRotate;
    controls.rotateSpeed = rotateSpeed;
    controls.zoomSpeed = zoomSpeed;

    const onMouseDown = () => {
      effect.domElement.style.cursor = "grabbing";
    };
    const onMouseUp = () => {
      effect.domElement.style.cursor = "grab";
    };
    effect.domElement.addEventListener("mousedown", onMouseDown);
    effect.domElement.addEventListener("mouseup", onMouseUp);

    let animId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      if (modelGroup) {
        modelGroup.rotation.y = elapsed * rotationSpeed;
      }
      controls.update();
      effect.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      effect.setSize(w, h);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
      effect.domElement.removeEventListener("mousedown", onMouseDown);
      effect.domElement.removeEventListener("mouseup", onMouseUp);
      controls.dispose();
      renderer.dispose();
      if (container.contains(effect.domElement)) {
        container.removeChild(effect.domElement);
      }
    };
  }, [
    modelPath,
    characters,
    invert,
    fontSize,
    lineHeight,
    scale,
    rotationSpeed,
    zoomSpeed,
    enableZoom,
    enablePan,
    enableRotate,
    rotateSpeed,
    backgroundColor,
    textColor,
    fontFamily,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-screen w-screen overflow-hidden bg-black", className)}
    />
  );
};

export const Skipper14: React.FC = () => {
  return (
    <div className="relative h-screen w-screen bg-black">
      <AsciiSimulation />
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs tracking-widest font-mono text-green-500/60 uppercase">
        ASCII 3D Model • Drag to orbit
      </div>
    </div>
  );
};

export const DemoSkipper14 = Skipper14;
export default Skipper14;
