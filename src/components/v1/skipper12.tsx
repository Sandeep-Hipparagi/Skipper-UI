"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface LiquidSimulationProps {
  imagePath?: string;
  text?: string;
  className?: string;
}

export const LiquidSimulation: React.FC<LiquidSimulationProps> = ({
  imagePath = "/skipperv1/skipper12/vercel_logo_liquid.avif",
  text = "Vercel Liquid Simulation",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const resolution = new THREE.Vector2(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    );

    const targetOptions = {
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };

    let fboA = new THREE.WebGLRenderTarget(resolution.x, resolution.y, targetOptions);
    let fboB = new THREE.WebGLRenderTarget(resolution.x, resolution.y, targetOptions);

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        mouse: { value: mouse },
        resolution: { value: resolution },
        time: { value: 0 },
        frame: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D textureA;
        uniform vec2 mouse;
        uniform vec2 resolution;
        uniform float time;
        uniform int frame;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          if (frame == 0) {
            gl_FragColor = vec4(0.0);
            return;
          }
          vec4 data = texture2D(textureA, uv);
          float pressure = data.x;
          float pVel = data.y;

          vec2 texelSize = 1.0 / resolution;
          float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
          float p_left  = texture2D(textureA, uv - vec2(texelSize.x, 0.0)).x;
          float p_up    = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
          float p_down  = texture2D(textureA, uv - vec2(0.0, texelSize.y)).x;

          pVel += (p_right + p_left + p_up + p_down - 4.0 * pressure) * 0.25;
          pVel *= 0.985;
          pressure += pVel;

          float d = distance(uv * resolution, mouse);
          if (d < 35.0) {
            pressure += (1.0 - d / 35.0) * 0.5;
          }

          gl_FragColor = vec4(pressure, pVel, 0.0, 1.0);
        }
      `,
    });

    const displayMaterial = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { value: null },
        logoTexture: { value: null },
        resolution: { value: resolution },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D textureA;
        uniform sampler2D logoTexture;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv;
          vec2 texel = 1.0 / resolution;
          float p_right = texture2D(textureA, uv + vec2(texel.x, 0.0)).x;
          float p_left  = texture2D(textureA, uv - vec2(texel.x, 0.0)).x;
          float p_up    = texture2D(textureA, uv + vec2(0.0, texel.y)).x;
          float p_down  = texture2D(textureA, uv - vec2(0.0, texel.y)).x;

          vec2 distortion = vec2(p_right - p_left, p_up - p_down) * 0.08;
          vec4 logo = texture2D(logoTexture, uv + distortion);

          vec3 baseColor = vec3(0.04);
          vec3 liquidColor = vec3(0.95);
          vec3 finalColor = mix(baseColor, liquidColor, logo.a);

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imagePath, (tex) => {
      displayMaterial.uniforms.logoTexture.value = tex;
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial);
    scene.add(quad);

    let frame = 0;
    let animationId: number;

    const onPointerMove = (e: MouseEvent) => {
      mouse.x = e.clientX * window.devicePixelRatio;
      mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
    };

    window.addEventListener("mousemove", onPointerMove);

    const animate = () => {
      simMaterial.uniforms.textureA.value = fboA.texture;
      simMaterial.uniforms.frame.value = frame;
      quad.material = simMaterial;
      renderer.setRenderTarget(fboB);
      renderer.render(scene, camera);

      displayMaterial.uniforms.textureA.value = fboB.texture;
      quad.material = displayMaterial;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);

      const temp = fboA;
      fboA = fboB;
      fboB = temp;

      frame++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      resolution.set(w * window.devicePixelRatio, h * window.devicePixelRatio);
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      fboA.dispose();
      fboB.dispose();
    };
  }, [imagePath]);

  return (
    <div className={cn("relative h-screen w-screen bg-[#0a0a0a] overflow-hidden", className)}>
      <div ref={containerRef} className="absolute inset-0 size-full cursor-pointer" />
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-xs tracking-widest uppercase text-white/40 font-mono">
        {text} • Move cursor to ripple
      </div>
    </div>
  );
};

export const Skipper12: React.FC = () => {
  return <LiquidSimulation />;
};

export const DemoSkipper12 = Skipper12;
export default Skipper12;
